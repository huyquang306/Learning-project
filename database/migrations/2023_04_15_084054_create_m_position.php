<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMPosition extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_position', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key');
            $table->string('code', 5)
                ->comment('Code: Classification code of position (manager, person in charge, etc.)');
            $table->string('name', 10)
                ->nullable(true)
                ->comment('Position name');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')
                ->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes();
            $table->unsignedBigInteger('modified_by')
                ->nullable(true)
                ->comment('Last Modified By: Saves the s_account.id of the last modified person');
        });
        DB::statement("ALTER TABLE `m_position` comment 'Position master data'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_position');
    }
}
