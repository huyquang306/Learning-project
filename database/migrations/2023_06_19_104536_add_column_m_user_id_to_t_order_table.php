<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnMUserIdToTOrderTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('t_order', function (Blueprint $table) {
            $table->unsignedBigInteger('m_user_id')
                ->nullable()
                ->after('r_shop_menu_id');
            $table->unsignedBigInteger('modified_by')
                ->nullable(true)
                ->comment('Last Modified By: Saves the s_account.id of the last modified person');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('t_order', function (Blueprint $table) {
            $table->dropColumn('m_user_id');
            $table->dropColumn('modified_by');
        });
    }
}
