import { CommercialRoutes } from './Commercial';
import { CommonRoutes } from './Common';
import { DashboardRoutes } from './Dashboard';
import { DeliveryRoutes } from './Delivery';
import { DyeingAndIronRoutes } from './DyeingAndIron';
import { HrRoutes } from './Hr';
import { IssueRoutes } from './Issue';
import { LabDipRoutes } from './LabDip';
import { LibraryRoutes } from './Library';
import { MarketingRoutes } from './Marketing';
import { MetalRoutes } from './Metal';
import { NylonRoutes } from './Nylon';
import { OrderRoutes } from './Order';
import { PlanningRoutes } from './Planning';
import { ProfileRoutes } from './Profile';
import { ReportRoutes } from './Report';
import { SliderRoutes } from './Slider';
import { StoreRoutes } from './Store';
import { ThreadRoutes } from './Thread';
import { VislonRoutes } from './Vislon';

const privateRoutes = [
	...DashboardRoutes,
	...ReportRoutes,
	...OrderRoutes,
	...ThreadRoutes,
	...CommercialRoutes,
	...StoreRoutes,
	...CommonRoutes,
	...LabDipRoutes,
	...PlanningRoutes,
	...DyeingAndIronRoutes,
	...SliderRoutes,
	...NylonRoutes,
	...VislonRoutes,
	...MetalRoutes,
	...DeliveryRoutes,
	...HrRoutes,
	...LibraryRoutes,
	...IssueRoutes,
	...MarketingRoutes,
	...ProfileRoutes,
];

export default privateRoutes;
