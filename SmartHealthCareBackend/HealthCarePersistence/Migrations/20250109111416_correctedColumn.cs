using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class correctedColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Patients");

            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "87ae5f1c-91e9-4e99-827e-460171d1bfdc", new DateTime(2025, 1, 9, 11, 14, 16, 79, DateTimeKind.Utc).AddTicks(3615), "AQAAAAIAAYagAAAAEO7Mot3LWiOVoPpKIMpr+xjyW4gDFGwGFE7XMwV/11HYxNJ+LCowD7wz4cpt31OEFg==", "e8ae62fe-0392-440d-a00d-eb2138970cf3", new DateTime(2025, 1, 9, 11, 14, 16, 79, DateTimeKind.Utc).AddTicks(3621) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

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
    }
}
