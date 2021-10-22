<template>
	<div class="container">
		<h2 class="text-center mt-5">Products List</h2>
		<!-- input -->
		<div class="d-flex">
			<input v-model="product.name" class="form-control rounded-0" placeholder="Name" />
			<input v-model="product.code" class="form-control rounded-0" placeholder="Code" />
			<input v-model="product.price" class="form-control rounded-0" placeholder="Price" />
			<button @click="submit" class="btn btn-warning rounded-0">SUBMIT</button>
		</div>
		<!-- when empty -->
		<div v-if="!products.length" class="m-5 text-center">
			<div>No-DATA. You can populate datas by clicking this <a href="#" @click="populate()" class="text-primary bold" >link</a></div>
			<div v-if="isLoading"> ... loading datas </div>
		</div>
		<!-- table -->
		<table v-if="products.length" class="table table-bordered mt-5">
			<thead>
			<tr>
				<th scope="col">Name</th>
				<th scope="col">Code</th>
				<th scope="col">Price</th>
				<th scope="col" class="text-center">#</th>
				<th scope="col" class="text-center">#</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(product, index) in products" :key="index">
				<td>{{ product.name }}</td>
				<td>{{ product.code }}</td>
				<td>{{ product.price }}</td>
				<td>
				<div class="text-center" @click="edit(index)">
					<span class="fa fa-pen"></span>
				</div>
				</td>
				<td>
				<div class="text-center" @click="trash(index)">
					<span class="fa fa-trash"></span>
				</div>
				</td>
			</tr>
			</tbody>
		</table>
		<nav aria-label="...">
			<paginate
				v-model="page" 
				:page-count=this.pageCount
				:click-handler="pageClick"
				:page-class="'page-item'"
				:page-link-class="'page-link'"
				:prev-text="'Prev'"
				:prev-class="'page-item'"
				:next-class="'page-item'"
				:prev-link-class="'page-link'"
				:next-link-class="'page-link'"
				:next-text="'Next'"
				:container-class="'pagination'">
			</paginate>
		</nav>
	</div>
</template>
<script>
import axios from 'axios'
export default {
	name: 'Products',
	data() {
		return {
			isLoading: false,
			page: 1,
			pageCount: 0,
			editIndex: 0,
			product:{
				name:'',
				code:'',
				price:null
			},
			products: []
		}
	},
	async created(){
		try {
			let count = await this.getData()
			if(!count)
				console.log('no-data')
			this.pageCount = parseInt(Math.ceil(count / 10))
		}catch(e){
			console.log(e)
		}
	},
	methods: {
		async populate(){
			try {
				this.isLoading = true;
				const response = await axios.get('/populate')
				
				if(response.status == 200) {
					let count = await this.getData()
					this.isLoading = false;
					if(!count)
						console.log('no-data')
					this.pageCount = parseInt(Math.ceil(count / 10))
					
				}
			}catch(e){
				console.log(e)
			}
		},
		async getData(){
			try {
				const response = await axios.get('/?page=' + this.page)
				if(response.status !== 200)
					return false
				this.products = response.data.docs
				
				return response.data.totalDocs
			}catch(e){
				console.log(e)
			}
		},
		async paginate() {
			let result = await this.getData()
			if(!result)
				console.log('no-data')
		},
		pageClick(pageNum){
			this.page = pageNum
			this.paginate()
		},
		async submit() {
			if (!this.product.name.length)
				return 0
			
			if(!this.editIndex) {
				// create new
				let result = await axios.post('/', this.product)
				if(result.status !== 200)
					return false
			} else {
				let {code, name, price} = this.product
				 // api edit for product item based on current index - 1
				let result = await axios.put('/'+this.products[this.editIndex-1]._id, {code, name, price})
				if(result.status !== 200)
					return false
			}
			// clear product model and reload data
			this.product = {
				name:'',
				code:'',
				price:null
			}
			this.paginate()
		},
		edit(index) {
			// Added +1 to get 0-index to truthy
			this.editIndex = index + 1
			// avoiding pass by reference
			let { name, code, price } = this.products[index]
			this.product = { name, code, price }
		},
		async trash(index) {
			let result = await axios.delete('/'+this.products[index]._id)
			if(result.status !== 200)
				return false
			// re-render products model
			this.paginate()
		}
	}
}
</script>