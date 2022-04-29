import type { App, Component, Plugin } from 'vue';
import uiComponents from './ui';
import { moduleFilter } from '@/util/helper';

const ComponentPlugin: Plugin = {
  install(app: App) {
    injectComponents(app);
    useAntd(app);
  }
};

export default ComponentPlugin;

function injectComponents(app: App<Element>) {
  const modules = moduleFilter<Component>(require.context('./modules/', true, /\.(vue|tsx)$/));

  //  匹配文件名称的正则
  const componentRegex = /\/([\w\d-]+)([.-]component)?\/([\w\d-]+)([.-]component)?\.(vue|tsx)$/;

  Object.keys(modules).forEach((filename) => {
    const component = modules[filename] as Component;

    const fileMatch = filename.match(componentRegex);

    //  获取组件名称
    //  组件名称匹配规则
    //  1.获取组件内部name属性
    //  2. 如果文件名称不为index, 则取文件名称作为name, 否则取文件名称的上一级目录作为组件名称 文件名称和目录名称都会去掉[.-]component
    const componentName = component.name || (fileMatch[3] && fileMatch[3] !== 'index' ? fileMatch[3] : fileMatch[1]);
    app.component(componentName, component);
  });
}

function useAntd(app: App): App {
  uiComponents.forEach((component) => {
    app.use(component);
  });
  return app;
}
