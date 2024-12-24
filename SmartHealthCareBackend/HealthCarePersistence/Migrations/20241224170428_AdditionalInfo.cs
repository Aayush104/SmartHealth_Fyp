using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class AdditionalInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DoctorAdditionalInfos",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ExperienceDetail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Trainings = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DoctorId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorAdditionalInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DoctorAdditionalInfos_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DoctorAdditionalInfos_Doctors_Id",
                        column: x => x.Id,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "c11fa64c-a5f1-4f2b-b4a6-fdbff9f8cd56", new DateTime(2024, 12, 24, 17, 4, 25, 381, DateTimeKind.Utc).AddTicks(1254), "AQAAAAIAAYagAAAAECjIW1vrW7snFSLVwBq3Meq8k2/SYYtySRrWPISrpz3WtbTgqgDA2OQbK2Grqi8Cfg==", "e53c4da3-0356-4433-b122-37ecac1d9fd9", new DateTime(2024, 12, 24, 17, 4, 25, 381, DateTimeKind.Utc).AddTicks(1262) });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorAdditionalInfos_DoctorId",
                table: "DoctorAdditionalInfos",
                column: "DoctorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DoctorAdditionalInfos");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "7e4f4575-d6dd-4982-a1fe-e54dfb24bdd3", new DateTime(2024, 12, 20, 17, 12, 55, 898, DateTimeKind.Utc).AddTicks(5558), "AQAAAAIAAYagAAAAEE2SQCmaBls/8wHgMn+GsYVjNuCA9CYp4A4feDYnBd0SYLzPgZTfBMRJKEffP2k8pQ==", "7c997f8d-6ea8-40a7-999a-d312b04bcf87", new DateTime(2024, 12, 20, 17, 12, 55, 898, DateTimeKind.Utc).AddTicks(5561) });
        }
    }
}
