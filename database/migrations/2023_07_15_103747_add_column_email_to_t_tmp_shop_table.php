<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnEmailToTTmpShopTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('t_tmp_shop', function (Blueprint $table) {
            $table->string('email', 100)
                ->default(null)
                ->after('hash_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('t_tmp_shop', function (Blueprint $table) {
            $table->dropColumn('email');
        });
    }
}
