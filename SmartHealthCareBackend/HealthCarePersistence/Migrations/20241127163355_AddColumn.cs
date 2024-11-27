using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class AddColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Doctors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "7f1d9e2f-742c-48b2-a82f-2c508b799c7c", new DateTime(2024, 11, 27, 16, 33, 52, 866, DateTimeKind.Utc).AddTicks(9696), "AQAAAAIAAYagAAAAEEFxoiKI/OFCjv10izDbjdkIp0AlB2sv9RLFXggDZlThb8XWhNCpv1dQl1XMdL7pSg==", "57b2c741-95a4-4574-bac8-6a0124fed78f", new DateTime(2024, 11, 27, 16, 33, 52, 866, DateTimeKind.Utc).AddTicks(9702) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Doctors",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "8b66d0d8-7423-4b15-84ae-37848613b001", new DateTime(2024, 10, 22, 11, 16, 39, 47, DateTimeKind.Utc).AddTicks(3858), "AQAAAAIAAYagAAAAEIrLpxZkhm20RX1VBFN0TJ3dx1k6vjxz1oV3LI2C7JwR52p4ObHPXsTWgNrzp6WwYA==", "7b28d09a-cc8a-4360-a91d-9ad7c4ffb1e7", new DateTime(2024, 10, 22, 11, 16, 39, 47, DateTimeKind.Utc).AddTicks(3866) });
        }
    }
}
