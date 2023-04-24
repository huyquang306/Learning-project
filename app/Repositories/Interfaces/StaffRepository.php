<?php

namespace App\Repositories\Interfaces;

use App\Models\MStaff;
use App\Models\SAccount;
use App\Repositories\BaseRepository;

class StaffRepository extends BaseRepository implements StaffRepositoryInterface
{

    public function getModel(): string
    {
        return MStaff::class;
    }

    public function getSAccountByFireBaseUid(string $uid)
    {
        return SAccount::where('firebase_uid', $uid)->first();
    }
}