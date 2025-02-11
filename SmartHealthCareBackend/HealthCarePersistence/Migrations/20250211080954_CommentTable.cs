using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class CommentTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_AspNetUsers_UserId",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Comments",
                newName: "PatientId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_UserId",
                table: "Comments",
                newName: "IX_Comments_PatientId");

            migrationBuilder.AddColumn<string>(
                name: "DoctorId",
                table: "Comments",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "2a9a3f8d-2c54-4424-a9dd-8dc92cac027a", new DateTime(2025, 2, 11, 8, 9, 51, 426, DateTimeKind.Utc).AddTicks(1867), "AQAAAAIAAYagAAAAEIHaqVyHJ8jqe+p3IdbcUo8/HCgUWzpta2zoIPWnALtUAMpgUF77UaFF53LA4Aj8pA==", "11b652c9-ea4b-410d-8ce2-1fc1b9c92f9a", new DateTime(2025, 2, 11, 8, 9, 51, 426, DateTimeKind.Utc).AddTicks(1879) });

            migrationBuilder.CreateIndex(
                name: "IX_Comments_DoctorId",
                table: "Comments",
                column: "DoctorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Doctors_DoctorId",
                table: "Comments",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Patients_PatientId",
                table: "Comments",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Doctors_DoctorId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Patients_PatientId",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_DoctorId",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "DoctorId",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "PatientId",
                table: "Comments",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_PatientId",
                table: "Comments",
                newName: "IX_Comments_UserId");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "3220aeae-773d-4ab9-9bee-3c33bbff2bc4", new DateTime(2025, 2, 7, 8, 46, 47, 649, DateTimeKind.Utc).AddTicks(7571), "AQAAAAIAAYagAAAAEFGk17VDErT+JMhUtQmCxxibzvYvz+MznEQPD6fi9AlE8Gnt3cozBCT14K29Er7R0g==", "43d526f9-0fdd-4146-b361-f9beadc77921", new DateTime(2025, 2, 7, 8, 46, 47, 649, DateTimeKind.Utc).AddTicks(7578) });

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_AspNetUsers_UserId",
                table: "Comments",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
