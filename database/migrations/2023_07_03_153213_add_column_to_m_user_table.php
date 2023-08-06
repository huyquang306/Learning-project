<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToMUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('m_user', function (Blueprint $table) {
            $table->string('hash_id', 16)
                ->nullable(true)
                ->after('id');
            $table->string('firebase_uid', 128)
                ->nullable(true)
                ->after('hash_id');
            $table->string('nick_name', 50)
                ->nullable(true)
                ->after('firebase_uid');
            $table->string('email', 128)
                ->nullable(true)
                ->after('firebase_uid');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('m_user', function (Blueprint $table) {
            $table->dropColumn('hash_id');
            $table->dropColumn('firebase_uid');
            $table->dropColumn('email');
            $table->dropColumn('phone_number');
        });
    }
}
