import "module-alias/register";
import "reflect-metadata";
import App from "./App";
import Server from "./server";
import { container } from "tsyringe";
import { registerProductionDependencies } from "@/di";

// Inject dependencies:
registerProductionDependencies();

const app = container.resolve(App);
// Server creation:
const serverInstance = Server.getServer(app);
export default serverInstance;
