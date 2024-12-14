using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class profile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Availability",
                table: "Doctors",
                newName: "Profile");

            migrationBuilder.AddColumn<string>(
                name: "AvailabilityDays",
                table: "Doctors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AvailabilityTime",
                table: "Doctors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Doctors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Fee",
                table: "Doctors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "0f729b32-07a3-42ea-82c4-0c75eca6f710", new DateTime(2024, 12, 14, 16, 19, 30, 705, DateTimeKind.Utc).AddTicks(7083), "AQAAAAIAAYagAAAAEG5YHYYwgtkeKyJSntFOeINLalZNCoBNjdl+eDgtvDNOCGX682YrvugbYFrOcBsNwA==", "3439ae42-02bc-4724-b6ad-5004c3e14893", new DateTime(2024, 12, 14, 16, 19, 30, 705, DateTimeKind.Utc).AddTicks(7095) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailabilityDays",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "AvailabilityTime",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Fee",
                table: "Doctors");

            migrationBuilder.RenameColumn(
                name: "Profile",
                table: "Doctors",
                newName: "Availability");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "7f1d9e2f-742c-48b2-a82f-2c508b799c7c", new DateTime(2024, 11, 27, 16, 33, 52, 866, DateTimeKind.Utc).AddTicks(9696), "AQAAAAIAAYagAAAAEEFxoiKI/OFCjv10izDbjdkIp0AlB2sv9RLFXggDZlThb8XWhNCpv1dQl1XMdL7pSg==", "57b2c741-95a4-4574-bac8-6a0124fed78f", new DateTime(2024, 11, 27, 16, 33, 52, 866, DateTimeKind.Utc).AddTicks(9702) });
        }
    }
}
