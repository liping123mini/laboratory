Component({
	properties: {
		options: {
			type: Array,
			value: [],
			// observer: function(newVal,oldVal) {
			// 	console.log(newVal,oldVal)
			// }
		},
		defaultOption: {
			type: Object,
			value: {
				// id: '000',
				// name: '全部城市'
			}
		},
		mul: { //判断是否可以多选
			type: Boolean,
			value: false
		},
		key: {
			type: String,
			value: 'id'
		},
		text: {
			type: String,
			value: 'name'
		},
		placeholder: {
			type: String,
			value: 'placeholder'
		},
		semChoose: {
			type: String,
			value: ''
		},
		btnmss: {  //用来判断是添加还是编辑
			type: String,
			value: ''
		},
	},
	data: {
		result: [],
		isShow: false,
		current: {},
		select_all: false,
		batchIds: '',
		batchIds1: '',
		classnames:'',
		classnames1: '',
		classes:[], //班级变量,
		count: 0
	},
	ready() {
		if("添加" === this.data.btnmss) {
			this.setData({ current: null })
			if(this.data.result.length > 0) {
				this.setData({ classes: this.data.result })
			}
		}
	},
	methods: {
		chooseClas(e) {
		//班级选择  classnames1
			let tpl = this.data.batchIds.join(","),tpl1 = this.data.classnames.join(",")
			this.setData({ isShow: false,current:{name:tpl1} })
			this.triggerEvent("chooseClas", { classids:tpl,classnames:tpl1})
		},
		//多选
		duoxuan(e) {
			let index = e.currentTarget.dataset.index,arr = [],arr1 = []
			this.setData({
				['classes[' + index + '].checked']: !this.data.classes[index].checked
			})
			let classes = this.data.classes
			classes.forEach(ele => {
				if(ele.checked) {
					arr.push(ele.id)
					arr1.push(ele.claname)
				}
			})
			this.setData({
				batchIds: arr,
				classnames: arr1
			})
		},
		optionTap(e) {
			let dataset = e.target.dataset,count = this.data.count
			if("claname" !== this.data.text) {
				this.setData({
					current: dataset,
					isShow: false
				});
			}
			// 调用父组件方法，并传参
			this.triggerEvent("change", { ...dataset})
		},
		openClose() {
			this.setData({
				isShow: !this.data.isShow,
				select_all: false
			})
			if ('batch' === this.data.text) {
				if(this.data.semChoose.length <= 0) {
					wx.showToast({
						'title':'请先选择学期',
						'icon': 'none'
					})
				}
			}else if("claname" === this.data.text) {
				let classes = this.data.options
				if(classes.length <=0 && this.data.btnmss === '添加') {
					this.setData({ isShow:false })
					wx.showToast({
						'title':'请先选择批次',
						'icon': 'none'
					})
				}else {
					for (let i = 0; i < classes.length; i++) {
						classes[i].checked = false
						classes[i].name = classes[i].claname
					}
					this.setData({ classes:classes,result:classes })
				}
			}else if("labname" === this.data.text) {
				if(this.data.options.length <=0 && this.data.btnmss === '添加' ) {
					this.setData({ isShow:false })
					wx.showToast({
						'title':'请先选择批次',
						'icon': 'none'
					})
				}
			}
		},

		// 此方法供父组件调用
		close() {
			this.setData({
				isShow: false
			})
		}
	},
	observers: {
		'options':function(v1) {
			let result = []
			if("labname" === this.data.text && v1.length > 0) {
				for (let item of this.data.options) {
					let {
						[this.data.key]: id, [this.data.text]: name
					} = item
					result.push({
						id,
						name
					})
				}
				this.setData({
					current: Object.assign({}, this.data.defaultOption),
					result: result
				})
			}
			
		}
	},
	lifetimes: {
		attached() {
			// 属性名称转换, 如果不是 { id: '', name:'' } 格式，则转为 { id: '', name:'' } 格式
			let result = []
			if (this.data.key !== 'id' || this.data.text !== 'name') {
				for (let item of this.data.options) {
					let {
						[this.data.key]: id, [this.data.text]: name
					} = item
					result.push({
						id,
						name
					})
				}
			}
			this.setData({
				current: Object.assign({}, this.data.defaultOption),
				result: result
			})
		}
	}
})
