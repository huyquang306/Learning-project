<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateColumnCodeInMMenuCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('m_menu_category', function (Blueprint $table) {
            $table->string('code', 16)->change();
            $table->bigInteger('parent_id')->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('m_menu_category', function (Blueprint $table) {
            $table->string('code', 5)->change();
            $table->bigInteger('parent_id')->change();
        });
    }
}
