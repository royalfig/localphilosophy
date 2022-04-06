// Ship JS only active on post pages for better performance
import { share, copy } from './share';
import { createSingleLocationMap } from '../app/map';

share();
copy();
createSingleLocationMap();
