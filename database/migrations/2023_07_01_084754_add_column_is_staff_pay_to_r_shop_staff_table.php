<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnIsStaffPayToRShopStaffTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('r_shop_staff', function (Blueprint $table) {
            $table->tinyInteger('is_staff_pay')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('r_shop_staff', function (Blueprint $table) {
            $table->dropColumn('is_staff_pay');
        });
    }
}
