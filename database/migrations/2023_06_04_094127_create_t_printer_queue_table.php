<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTPrinterQueueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('t_printer_queue', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_printer_id')
                ->nullable(false)
                ->default(0);
            $table->string('hash_id', 16)
                ->nullable();
            $table->text('content');
            $table->integer('status');
            $table->timestamps();

            $table->foreign('m_printer_id')
                ->references('id')
                ->on('m_printer');
            $table->index('m_printer_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('t_printer_queue');
    }
}
