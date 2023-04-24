<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Exception\AuthException;
use Kreait\Firebase\Exception\FirebaseException;
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

class FirebaseService
{
    protected $firebase;
    protected $auth;

    public function __construct()
    {
        $serviceAccount = ServiceAccount::fromValue([
            'type' => 'service_account',
            'project_id' => config('services.firebase.project_id'),
            'private_key_id' => config('services.firebase.private_key_id'),
            'private_key' => config('services.firebase.private_key'),
            'client_email' => config('services.firebase.client_email'),
            'client_id' => config('services.firebase.client_id'),
            'auth_uri' => 'https://accounts.google.com/o/oauth2/auth',
            'token_uri' => 'https://oauth2.googleapis.com/token',
            'auth_provider_x509_cert_url' => 'https://www.googleapis.com/oauth2/v1/certs',
            'client_x509_cert_url' => config('services.firebase.client_x509_cert_url')
        ]);
        $this->firebase = (new Factory)
            ->withServiceAccount($serviceAccount);
        $this->auth = $this->firebase->createAuth();
    }

    /**
     * @throws FirebaseException
     * @throws AuthException
     */
    public function disableAccount(string $accountUid)
    {
        $this->auth->disableUser($accountUid);
    }

    /**
     * @throws AuthException
     * @throws FirebaseException
     */
    public function enableAccount(string $accountUid)
    {
        $this->auth->enableUser($accountUid);
    }

    /**
     * @param array $uids
     * @return array
     * @throws AuthException
     * @throws FirebaseException
     */
    public function getAccountsActiveByUids(array $uids): array
    {
        if (empty($uids)) {
            return [];
        }

        $firebaseAccounts = $this->auth->getUsers($uids);
        $activeAccounts = collect($firebaseAccounts)->filter(function ($account) {
            return $account && ($account->phoneNumber || $account->emailVerified);
        });

        return $activeAccounts->toArray();
    }

    /**
     * @param string $email
     * @param array $data
     * @return bool
     * @throws AuthException
     * @throws FirebaseException
     */
    public function updateAccount(string $email, array $data): bool
    {
        try {
            $user = $this->auth->getUserByEmail($email);
            $this->auth->updateUser($user->uid, $data);

            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * @param string $email
     * @param string $customUrl
     * @return void
     */
    public function sendForgotPasswordLink(string $email, string $customUrl)
    {
        $actionSettings = [
            'url' => $customUrl,
            'handleCodeInApp' => true,
        ];

        $this->auth->sendPasswordResetLink($email, $actionSettings);
    }

    /**
     * @param string $email
     * @return \Kreait\Firebase\Auth\UserRecord
     * @throws AuthException
     * @throws FirebaseException
     */
    public function getFirebaseAccountByEmail(string $email): \Kreait\Firebase\Auth\UserRecord
    {
        return $this->auth->getUserByEmail($email);
    }

    /**
     * Send email verification link
     *
     * @param string $email
     * @param string $customUrl
     * @return void
     */
    public function sendRegisterVerifyLink(string $email, string $customUrl)
    {
        $actionSettings = [
            'url' => $customUrl,
            'handleCodeInApp' => true,
        ];

        $this->auth->sendEmailVerificationLink($email, $actionSettings);
    }
}
