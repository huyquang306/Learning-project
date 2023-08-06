<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeColumnNameInMCourseTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('m_course', function (Blueprint $table) {
            $table->renameColumn('initial_propose_flag', 'initial_propose_flg');
            $table->renameColumn('shop_alert_flag', 'shop_alert_flg');
            $table->renameColumn('user_alert_flag', 'user_alert_flg');
            $table->renameColumn('shop_end_time_alert_flag', 'shop_end_time_alert_flg');
            $table->renameColumn('user_end_time_alert_flag', 'user_end_time_alert_flg');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('m_course', function (Blueprint $table) {
            $table->renameColumn('initial_propose_flg', 'initial_propose_flag');
            $table->renameColumn('shop_alert_flg', 'shop_alert_flag');
            $table->renameColumn('user_alert_flg', 'user_alert_flag');
            $table->renameColumn('shop_end_time_alert_flg', 'shop_end_time_alert_flag');
            $table->renameColumn('user_end_time_alert_flg', 'user_end_time_alert_flag');
        });
    }
}
