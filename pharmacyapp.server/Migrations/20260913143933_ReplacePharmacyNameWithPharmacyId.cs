using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pharmacyapp.server.Migrations
{
    /// <inheritdoc />
    public partial class ReplacePharmacyNameWithPharmacyId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PharmacyName",
                table: "Orders");

            migrationBuilder.AddColumn<int>(
                name: "PharmacyId",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_PharmacyId",
                table: "Orders",
                column: "PharmacyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Pharmacies_PharmacyId",
                table: "Orders",
                column: "PharmacyId",
                principalTable: "Pharmacies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Pharmacies_PharmacyId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_PharmacyId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PharmacyId",
                table: "Orders");

            migrationBuilder.AddColumn<string>(
                name: "PharmacyName",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
