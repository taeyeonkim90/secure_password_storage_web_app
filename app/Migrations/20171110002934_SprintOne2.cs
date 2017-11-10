using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace app.Migrations
{
    public partial class SprintOne2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Datas_AspNetUsers_UserForeignKey",
                table: "Datas");

            migrationBuilder.AlterColumn<string>(
                name: "UserForeignKey",
                table: "Datas",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Datas_AspNetUsers_UserForeignKey",
                table: "Datas",
                column: "UserForeignKey",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Datas_AspNetUsers_UserForeignKey",
                table: "Datas");

            migrationBuilder.AlterColumn<string>(
                name: "UserForeignKey",
                table: "Datas",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddForeignKey(
                name: "FK_Datas_AspNetUsers_UserForeignKey",
                table: "Datas",
                column: "UserForeignKey",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
