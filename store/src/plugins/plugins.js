let myPlugins = {}
myPlugins.install = function(Vue, options) {
	/* Vue.prototype.$bus  //全局使用
	Vue.component
	Vue.filter */
	Vue.directive(options.name, (element, params) => {
		//options.name  全局自定义名称  element 使用全局自定义指令的  params 一些配置
		console.log(options.name,element, params)
		element.innerHTML = params.value.toUpperCase()
	})
}
export default myPlugins


/* 全局自定义指令，在main里面导入该自定义指令，然后在app或者
其他组件中使用，通过使用自定义指令，就可以对使用该自定义指令的DOM进行操作*/





