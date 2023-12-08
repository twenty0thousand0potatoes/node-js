"use strict";

import { v4 as uuidv4 } from 'uuid';
import {log} from 'console';

export function createOrder (number_card) {
  return validateCard(number_card)
    ? new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(uuidv4());
        }, 5000);
      })
    : new Promise((resolve, reject) => {
        reject("Card is not valid");
      });
};

const validateCard = (number_card) => {
  const cardNumberPattern = /^\d{4}_\d{4}_\d{4}_\d{4}$/;
  return cardNumberPattern.test(number_card);
};

export function proceedToPayment(orderId) {
    return new Promise((resolve, reject) => {
      if (Math.random() < 0.5) {
        resolve("Payment successful");
      } else {
        reject("Payment failed");
      }
    });
  }

