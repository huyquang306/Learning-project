import * as firebase from "firebase/app";
import 'firebase-auth';
import 'firebase-analytics';
import React, {useState, useEffect, useRef} from "react";
import PropTypes from 'prop-types';
import jwt_decode from 'jwt-decode';
import PubSub from 'pubsub-js';
import {closeCurrentSocket} from "../utils/helpers/socket";

export const AUTH_ERROR_CODES = {
  USER_NOT_SIGNED_IN: 'user-not-signed-in',
};

export const SIGN_IN_PROVIDER_VALUE = {
  emailPassword: 'password',
  phoneNumber: 'phone',
};

export default class AuthBase {
  constructor() {
    this.isInitialized = false;
    this.isSignedIn = false;
    this.currentUser = null;
    this.signInProvider = null;
  
    this.firebaseRecaptchaVarifier = null;
  }
  
  /**
   * initialize Firebase
   * @param {Object} config
   */
  initFirebase(config) {
    firebase.initializeApp(config);
    firebase.analytics();
    this.isInitialized = true;
    console.debug('firebase initialized');
  }
  
  /**
   * Create user with email, password
   * @param {string} email
   * @param {string} password
   */
  createUserWithEmailAndPassword(email, password) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => userCredential)
      .catch(error => {
        throw error;
      });
  }
  
  /**
   * Login user with email, password
   * @param {string} email
   * @param {string} password
   */
  signInWithEmailAndPassword(email, password) {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => userCredential)
      .catch(error => {
        throw error;
      });
  }
  
  sendEmailVerification() {
    firebase.auth().currentUser.sendEmailVerification()
      .then()
      .catch(error => {
        throw error;
      });
  }
  
  /**
   * Update new password
   * @param {string} password
   */
  updatePassword(password) {
    const currentUser = this.currentUser;
    if (!currentUser) {
      throw new Error('User is not logged in');
    }
    
    return firebase
      .auth()
      .currentUser
      .updatePassword(password);
  }
  
  /**
   * firebase Id token
   * @return {Promise<string>} token
   */
  setCurrentUser(currentUser) {
    this.currentUser = currentUser;
  }
  
  /**
   * Logout
   */
  signOut() {
    if (!this.currentUser) {
      throw new Error(AUTH_ERROR_CODES.USER_NOT_SIGNED_IN);
    }
    
    firebase.auth().signOut()
      .then()
      .catch(error => {
        throw error;
      });
    this.currentUser = null;
    this.signInProvider = null;
    PubSub.clearAllSubscriptions();
    closeCurrentSocket();
  }
  
  /**
   * Delete user
   * @returns {Promise<void>}
   */
  deleteCurrentUser() {
    return firebase
      .auth()
      .currentUser
      .delete()
  }
  
  /**
   * Get firebase Id token
   * @return {Promise<string>} token
   */
  getIdToken() {
    if (!this.currentUser) {
      throw new Error(AUTH_ERROR_CODES.USER_NOT_SIGNED_IN);
    }
    return this.currentUser.getIdToken();
  }
  
  /**
   * Custom auth hook
   *
   * @returns {Object|null}
   */
  useAuthState() {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
      firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          this.isSignedIn = true;
          this.currentUser = firebaseUser;
        } else {
          this.isSignedIn = false;
          this.currentUser = null;
        }
        setUser(firebaseUser);
      });
    }, []);
    
    return user;
  }
  
  /**
   * Get auth status
   *
   * @returns {Object}
   */
  getUserAuthStatus() {
    const [user, setUser] = useState({ statusCode: -1 });
    
    useEffect(() => {
      firebase.auth().onAuthStateChanged(async (firebaseUser) => {
        let statusCode = -1;
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          const tokenDecode = jwt_decode(token);
          this.signInProvider = tokenDecode?.firebase?.sign_in_provider;
          this.isSignedIn = true;
          this.currentUser = firebaseUser;
          statusCode = 1;
        } else {
          this.isSignedIn = false;
          this.currentUser = null;
          statusCode = 0;
        }
        setUser({ ...firebaseUser, statusCode });
      });
    }, []);
    
    return user;
  }
}

