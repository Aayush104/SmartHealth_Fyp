using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class changeAttribute : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AvailabilityTime",
                table: "Doctors",
                newName: "ToTime");

            migrationBuilder.RenameColumn(
                name: "AvailabilityDays",
                table: "Doctors",
                newName: "ToDay");

            migrationBuilder.AddColumn<string>(
                name: "FromDay",
                table: "Doctors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FromTime",
                table: "Doctors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "7e4f4575-d6dd-4982-a1fe-e54dfb24bdd3", new DateTime(2024, 12, 20, 17, 12, 55, 898, DateTimeKind.Utc).AddTicks(5558), "AQAAAAIAAYagAAAAEE2SQCmaBls/8wHgMn+GsYVjNuCA9CYp4A4feDYnBd0SYLzPgZTfBMRJKEffP2k8pQ==", "7c997f8d-6ea8-40a7-999a-d312b04bcf87", new DateTime(2024, 12, 20, 17, 12, 55, 898, DateTimeKind.Utc).AddTicks(5561) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromDay",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "FromTime",
                table: "Doctors");

            migrationBuilder.RenameColumn(
                name: "ToTime",
                table: "Doctors",
                newName: "AvailabilityTime");

            migrationBuilder.RenameColumn(
                name: "ToDay",
                table: "Doctors",
                newName: "AvailabilityDays");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "0f729b32-07a3-42ea-82c4-0c75eca6f710", new DateTime(2024, 12, 14, 16, 19, 30, 705, DateTimeKind.Utc).AddTicks(7083), "AQAAAAIAAYagAAAAEG5YHYYwgtkeKyJSntFOeINLalZNCoBNjdl+eDgtvDNOCGX682YrvugbYFrOcBsNwA==", "3439ae42-02bc-4724-b6ad-5004c3e14893", new DateTime(2024, 12, 14, 16, 19, 30, 705, DateTimeKind.Utc).AddTicks(7095) });
        }
    }
}
