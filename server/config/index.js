import fs from 'fs';
import path from 'path';
import { mergeDeepRight } from 'ramda';

const baseConfigPath = path.resolve(__dirname, 'config.json');
const envConfigPath = path.resolve(__dirname, `config.${process.env.NODE_ENV}.json`);

const baseConfigExists = fs.existsSync(baseConfigPath);

if (!baseConfigExists) {
  throw new Error('Missing configuration file!');
}

const baseConfig = JSON.parse(fs.readFileSync(baseConfigPath));
const envConfigExists = fs.existsSync(envConfigPath);
const config = envConfigExists
  ? mergeDeepRight(baseConfig, JSON.parse(fs.readFileSync(envConfigPath)))
  : baseConfig;

export default config;
