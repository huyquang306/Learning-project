<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSAuthentication extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('s_authentication', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key');
            $table->unsignedBigInteger('m_user_id')
                ->comment('Fk reference to user');
            $table->string('datasourse_code', 5)
                ->nullable(true)
                ->comment('External data source code : 00001: Google, 10001: Facebook, 20001: Twitter');
            $table->string('token', 1024)
                ->nullable(true)
                ->comment('ID token');
            $table->timestamp('token_expired_at')
                ->nullable(true)
                ->comment('Token expiration');
            $table->string('username', 25)
                ->nullable(true)
                ->comment('Username: Not required for external authentication');
            $table->string('emailaddress', 128)
                ->nullable(true)
                ->comment('email address');
            $table->string('password', 128)
                ->nullable(true)
                ->comment('Password: encrypted (SHA512 hash). Not required for external authentication');
            $table->string('tmp_password', 128)
                ->nullable(true)
                ->comment('Temporary password: encrypted (SHA512 hash). Not required for external authentication');
            $table->date('exp_of_tmp_password')
                ->nullable(true)
                ->comment('Temporary password expiration: not required for external authentication');
            $table->string('locale', 2)
                ->default('en')
                ->comment('ロケール');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')
                ->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes();
            $table->unsignedBigInteger('modified_by')
                ->nullable(true)
                ->comment('Last Modified By: Saves the s_account.id of the last modified person');
            $table->foreign('m_user_id')
                ->references('id')
                ->on('m_user');
            $table->unique('username');
            $table->index(['m_user_id']);
        });
        DB::statement("ALTER TABLE `s_authentication` comment 'User authentication master data'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('s_authentication');
    }
}
