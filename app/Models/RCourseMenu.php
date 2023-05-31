<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RCourseMenu extends Model
{
    use HasFactory;

    protected $table = 'r_course_menu';

    const ACTIVE_STATUS = 'active';
}
