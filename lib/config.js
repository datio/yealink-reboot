import fs from 'fs';
import * as yaml from 'yaml';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export const getDevices = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const rootDir = join(__dirname, '..');
  const env = yaml.parse(fs.readFileSync(join(rootDir, '.env.yml'), 'utf8'));
  return env.devices;
};