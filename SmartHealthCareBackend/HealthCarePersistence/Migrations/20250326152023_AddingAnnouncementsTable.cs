using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class AddingAnnouncementsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Announces",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Announces", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "863464ec-dd1d-4386-97d7-fc79fe6d4e18", new DateTime(2025, 3, 26, 15, 20, 20, 878, DateTimeKind.Utc).AddTicks(448), "AQAAAAIAAYagAAAAECJ1f78IerukzXxSc+uO6BDoCBVtFScLs4Z4BqdIAqLoTRS3X5V7/04E0euVDuUKmA==", "fca4a1ec-dd85-49ba-8593-454a268bba87", new DateTime(2025, 3, 26, 15, 20, 20, 878, DateTimeKind.Utc).AddTicks(452) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Announces");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "819977fa-76be-43a5-ab3e-849ed02305bf", new DateTime(2025, 3, 17, 4, 49, 56, 950, DateTimeKind.Utc).AddTicks(6534), "AQAAAAIAAYagAAAAEGomjnvW/XAsnx4fYm6XL/Cbi1k2+7ebenWasqXRX0xWHYhMg+QTSXPdMvHwqQ05Uw==", "801ebb4b-6a49-4dd6-b312-d6e23227eb76", new DateTime(2025, 3, 17, 4, 49, 56, 950, DateTimeKind.Utc).AddTicks(6543) });
        }
    }
}
