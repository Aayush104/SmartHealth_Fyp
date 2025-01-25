using Azure;
using HealthCareApplication.Contract.IService;
using HealthCareApplication.Dtos.AvailabilityDto;
using HealthCareApplication.Dtos.UserDtoo;
using HealthCareDomain.Entity.Appointment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using payment_gateway_nepal;
using System.Text;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HealthCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly string eSewa_SandboxKey = "8gBm/:&EnhH.1/q";

       
        // Testing mode only
        private readonly bool sandBoxMode = true;

        private string eSewaKey => eSewa_SandboxKey;
        public AppointmentController(IAppointmentService appointmentService)

        {
            _appointmentService = appointmentService;
        }


        //[HttpPost("BookAppointment")]
        //[Authorize(AuthenticationSchemes = "Bearer")]
        //public async Task<IActionResult> BookAppointment(AppointmentDto appointmentDto)
        //{
        //    var user = HttpContext.User.FindFirst("userId");

        //    var userId = user?.Value;

        //    if (string.IsNullOrEmpty(userId))
        //    {
        //        return Unauthorized("User not found");
        //    }

        //    var response = await _appointmentService.BookAppointmentAsync(appointmentDto, userId!);

        //    return StatusCode(response.StatusCode, response);
        //}

        [HttpPost("paywithesewa")]
        public async Task<IActionResult> Paywithesewa(PaymentDto paymentDto)
        {
            try
            {
               
                if (paymentDto == null || paymentDto.PaidAmount <= 0)
                {
                    return BadRequest(new { message = "Invalid payment details provided." });
                }

                PaymentManager paymentManager = new PaymentManager(
                    PaymentMethod.eSewa,
                    PaymentVersion.v2,
                    PaymentMode.Sandbox, 
                    eSewaKey
                );

                int taxAmount = 0;

                string currentUrl = $"{Request.Scheme}://{Request.Host}";
                string fronEndurl = "http://localhost:5173";
                var request = new
                {
                    Amount = paymentDto.PaidAmount,
                    TaxAmount = taxAmount,
                    TotalAmount = paymentDto.PaidAmount,
                  
                    TransactionUuid = $"tx-{Guid.NewGuid().ToString("N").Substring(0, 8)}",
                    ProductCode = "EPAYTEST",
                    ProductServiceCharge = 0,  // Your service charge if any
                    ProductDeliveryCharge = 0,
                    SuccessUrl = $"{fronEndurl}/Success",
                    FailureUrl = $"{fronEndurl}/Failure",
                    SignedFieldNames = "total_amount,transaction_uuid,product_code"
                };

                // Log the request payload for debugging
                Console.WriteLine("Payment Request:");
                Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(request));

                var response = await paymentManager.InitiatePaymentAsync<ApiResponse>(request);

                // Log the response for debugging
                Console.WriteLine("Payment Response:");
                Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(response));

               
                // Return the payment URL to the client
                return Ok(new { paymentUrl = response.data });
            }
            catch (Exception ex)
            {
                // Log the exception details
                Console.WriteLine("Error initiating payment:");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                // Return error response
                return StatusCode(500, new { message = "Failed to initiate payment", error = ex.Message });
            }
        }

        [HttpPost("Success")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> Success(AppointmentDto appointmentDto)
        {
            // Get user information from claims
            var user = HttpContext.User.FindFirst("userId");
            var userId = user?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not found" });
            }

            try
            {
                // Initialize payment manager
                var paymentManager = new PaymentManager(
                    PaymentMethod.eSewa,
                    PaymentVersion.v2,
                    PaymentMode.Sandbox,
                    eSewaKey
                );

                // Verify payment using the provided QueryType
                var response = await paymentManager.VerifyPaymentAsync<eSewaResponse>(appointmentDto.QueryType);

                // Ensure response and status are not null or empty
                if (response == null || string.IsNullOrEmpty(response.status))
                {
                    return BadRequest(new { message = "Payment verification failed or incomplete" });
                }

                // Check for a successful payment
                if (string.Equals(response.status, "complete", StringComparison.OrdinalIgnoreCase))
                {
                    decimal totalAmount = response.total_amount;

                    // Book the appointment with the payment details
                    var result = await _appointmentService.BookAppointmentAsync(appointmentDto, userId, totalAmount);

                    // Check if appointment booking was successful
                    if (result.IsSuccess)
                    {
                        return Ok(new { message = "Payment successful", data = result });
                    }
                    else
                    {
                        return BadRequest(new { message = "Appointment booking failed" });
                    }
                }
                else
                {
                    return BadRequest(new { message = "Invalid payment data received from eSewa", details = response });
                }
            }
            catch (Exception ex)
            {
               

                // Return generic error message to the client
                return StatusCode(500, new { message = "An error occurred while processing the payment", error = ex.Message });
            }
        }


        [HttpGet("Failure")]
        public IActionResult Failure()
        {
            // Handle failed payment
            return BadRequest(new { message = "Payment failed" });
        }

        [HttpGet("GetAppointmentList")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetAppointmentList()
        {
            var user = HttpContext.User.FindFirst("userId");

            var userId = user?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }

        var response = await _appointmentService.GetAppointmentListAsync(userId);

            return Ok(response);
        }
    }
}
