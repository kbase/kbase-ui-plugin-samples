import { StoreState } from "../store";
import accessFun from "./access";
import linkedDataFun from "./linkedData";
import sampleFun from "./sample";
import { AsyncProxyFactory } from "@kbase/ui-components/lib/redux/middleware/AsyncProxy";
import geolocationFun from "./geolocation";

export function makeActionProxy() {
  const asyncProxyFactory = new AsyncProxyFactory<StoreState>();
  asyncProxyFactory.add(sampleFun);
  asyncProxyFactory.add(linkedDataFun);
  asyncProxyFactory.add(accessFun);
  asyncProxyFactory.add(geolocationFun);
  return asyncProxyFactory.createMiddleware();
}
