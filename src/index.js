import './css/index.scss';
import AppService from './modules/app.service';
import './modules/header.components';
import { config } from './modules/config';
import './modules/ts.module.ts';

const appServise = new AppService('Привет из AppServise');
appServise.log();

console.log(config.key);