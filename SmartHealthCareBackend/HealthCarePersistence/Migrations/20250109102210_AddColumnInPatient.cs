using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnInPatient : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MedicalHistory",
                table: "Patients");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "86103987-0de3-49a5-8cd8-410ce84c5d9a", new DateTime(2025, 1, 9, 10, 22, 8, 405, DateTimeKind.Utc).AddTicks(3905), "AQAAAAIAAYagAAAAELt/VlQn6hjJCX4L9R3Embpl2+lzMhbhrsKZ2RuvkKx6BEDJWZ3OuFQpI7c7A8el9Q==", "e855ee99-1666-4b4c-9d97-fcaa59b53faf", new DateTime(2025, 1, 9, 10, 22, 8, 405, DateTimeKind.Utc).AddTicks(3909) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Patients");

            migrationBuilder.AddColumn<string>(
                name: "MedicalHistory",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "3dc72d79-6dec-46ce-9081-2b06b8799535", new DateTime(2024, 12, 24, 19, 57, 23, 346, DateTimeKind.Utc).AddTicks(8970), "AQAAAAIAAYagAAAAEJcqnQkz0l/nJzazHynh8CliIDsF0dyB9QJ/pzeiNF8NGYohhhTohnY4J6iK2Wqhmg==", "edbbe9f0-bafa-4c74-92cd-5248ba996d29", new DateTime(2024, 12, 24, 19, 57, 23, 346, DateTimeKind.Utc).AddTicks(8978) });
        }
    }
}
