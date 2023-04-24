<?php

namespace App\Services\Auth;

use App\Models\MStaff;
use App\Models\MUser;
use App\Models\SAccount;
use Firebase\Auth\Token\Verifier;
use http\Exception\BadMethodCallException;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Support\Facades\Log;

class FirebaseUserProvider implements UserProvider
{
    private $user;

    public function __construct()
    {
        $request = request();
        $url = $request->path();
        $this->user = null;
        $verifier = new Verifier(env('GOOGLE_PROJECT_ID'));
        $token = $request->bearerToken();
        try {
            if (!$token) {
                return;
            }
            $token = $verifier->verifyIdToken($token);
            $uid = $token->claims()->get('user_id');

            // Shop login & create account for staff as if its don't have before
            if (strpos($url, 'api/v1/shop') !== false) {
                $user = SAccount::where('firebase_uid', $uid)->first();
                if (!$user) {
                    \DB::transaction(function () use ($uid, &$user) {
                        $m_staff = new MStaff();
                        $m_staff->save();

                        $user = new SAccount();
                        $user->firebase_uid = $uid;
                        $user->m_staff_id = $m_staff->id;
                        $user->save();
                    });
                }
            }

            // Customer login and create account as if its don't have before
            if (strpos($url, 'api-or/v1/user') !== false) {
                $phoneNumber = $token->getClaim('phone_number');
                $user = MUser::where('firebase_uid', $uid)->first();
                if (!$user) {
                    \DB::transaction(function () use ($uid, $phoneNumber, &$user) {
                        $user = new MUser();
                        $user->hash_id = makeHash();
                        $user->firebase_uid = $uid;
                        $user->phone_number = $phoneNumber;
                        $user->save();
                    });
                }
            }
            $this->user = $user;
        } catch (Exception $e) {
            Log::info($e->getMessage());
            $this->user = null;
        }
    }

    public function user() :?Authenticatable
    {
        return $this->user;
    }

    public function retrieveById($identifier)
    {
        throw new BadMethodCallException("FirebaseUserProvider retrieveById is not available");
    }

    public function retrieveByToken($identifier, $token)
    {
        throw new BadMethodCallException("FirebaseUserProvider retrieveByToken is not available");
    }

    public function updateRememberToken(Authenticatable $user, $token)
    {
        throw new BadMethodCallException("FirebaseUserProvider updateRememberToken is not available");
    }

    public function retrieveByCredentials(array $credentials)
    {
        throw new BadMethodCallException("FirebaseUserProvider retrieveByCredentials is not available");
    }

    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        throw new BadMethodCallException("FirebaseUserProvider validateCredentials is not available");
    }
}
