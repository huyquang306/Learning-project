<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRFunctionCondition extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_function_condition', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_function_id');
            $table->unsignedBigInteger('m_condition_type_id');
            $table->tinyInteger('is_restricted')->default(true);
            $table->integer('restrict_value')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('m_function_id')
                ->references('id')
                ->on('m_function');
            $table->foreign('m_condition_type_id')
                ->references('id')
                ->on('m_condition_type');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_function_condition');
    }
}
