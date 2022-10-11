import * as Joi from 'joi';

import { validator } from '../../utils/validator';

const passwordValidation = Joi.string()
  .required()
  .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/);

const ageValidation = Joi.number().required().min(4).max(130);

const isDeletedValidation = Joi.boolean().default(false).required();

const idValidation = Joi.string().uuid().required();

const loginValidation = Joi.string().required();

const userAutoSuggestionSchema = Joi.object({
  login: loginValidation,
  limit: Joi.number().required(),
});

const userSchema = Joi.object({
  login: loginValidation,
  password: passwordValidation,
  age: ageValidation,
  isDeleted: isDeletedValidation,
});

const userIdSchema = Joi.object({
  id: idValidation,
});

export const updateValidation = [
  validator.params(idValidation),
  validator.body(userSchema),
];

export const createValidation = [validator.body(userSchema)];

export const deleteValidation = [validator.params(userIdSchema)];

export const getByIdValidation = [validator.params(userIdSchema)];

export const getAutoSuggestUsersValidation = [
  validator.query(userAutoSuggestionSchema),
];
