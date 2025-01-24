using Azure;
using HealthCareApplication.Contract.IService;
using HealthCareApplication.Dtos.AvailabilityDto;
using HealthCareApplication.Dtos.UserDtoo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using payment_gateway_nepal;

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


        [HttpPost("BookAppointment")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> BookAppointment(AppointmentDto appointmentDto)
        {
            var user = HttpContext.User.FindFirst("userId");

            var userId = user?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }

            var response = await _appointmentService.BookAppointmentAsync(appointmentDto, userId!);

            return StatusCode(response.StatusCode, response);
        }

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


        [HttpGet("Success")]
        public IActionResult Success(string transactionCode)
        {
            // Handle successful payment
            return Ok(new { message = "Payment successful", transactionCode });
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
