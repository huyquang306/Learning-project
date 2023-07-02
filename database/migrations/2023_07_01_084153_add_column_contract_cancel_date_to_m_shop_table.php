<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnContractCancelDateToMShopTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('m_shop', function (Blueprint $table) {
            $table->boolean('is_active')
                ->default(true)
                ->after('end_time')
                ->comment('Status of contract : True: Registered False: Cancelled');
            $table->dateTime('contract_cancel_date')
                ->nullable(true)
                ->after('is_active')
                ->comment('Cancel contract date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('m_shop', function (Blueprint $table) {
            $table->dropColumn('is_active');
            $table->dropColumn('contract_cancel_date');
        });
    }
}
