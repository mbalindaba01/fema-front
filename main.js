import "./style.css";
import axios from "axios";
import Alpine from "alpinejs";
import { Users } from "./users";
import { Services } from "./services";

window.Alpine = Alpine;

Alpine.data("users", Users);
Alpine.data("services", Services);

Alpine.data("users", () => {
	return {
		init() {
			this.getAllServices()
		},
		bookingFeedback: "",
		rating: "",
		rateCount: "",
		userBookingList: [],
		filterService: 'all',
		filterProvince: 'all',
		facilities: [],
		facilityBookingList: [],
		placeholderText: "",
		serviceList: [],
		allServices: [],
		serviceId: "",
		updateService: "",
		updateBookingDate: "",
		updateBookingTime: "",
		isbooking: false,
		isCheckingDetails: false,
		isEditingBooking: false,
		isDeletingBooking: false,
		showAllElems: true,
		nextStep: true,
		bookingSuccess: "",
		chosenService: "",
		signUpAuthError: "",
		currentUser: "",
		currentFacility: "",
		loggedInFac: "",
		loginAuthError: "",
		facAuthError: "",
		logFacAuthError: "",
		loggedIn: true,
		signedUp: true,
		facilityLoggedIn: true,
		facilitySignedUp: true,
		showUserScreen: false,
		showFacilityScreen: false,
		userAccess: true,
		showFacSec: true,
		showUserSec: true,
		bookingDate: "",
		bookingTime: "",
		bookingStatus: "",
		bookingId: "",

		user: {
			loginPassword: "",
			loginEmail: "",
			password: "",
			email: "",
			name: "",
		},
		facility: {
			facName: "",
			facEmail: "",
			contactno: "",
			reg: "",
			capacity: "",
			facPassword: "",
			province: "",
			city: "",
			pregnancyTermination: "",
			contraception: "",
			anteNatalCare: "",
			logFacPassword: "",
			logFacEmail: "",
			services: []
		},

		getFacilities(){
			axios
				.get(`https://fema-backend.herokuapp.com/fema/facilities`)
				.then(data => {
					this.facilities = data.data
				})
				.catch(error => console.log(error))
		},

		getServiceFacilities(){
			axios
				.get(`https://fema-backend.herokuapp.com/fema/serviceproviders/${this.filterService}`)
				.then(data => {
					this.facilities= data.data
				})
				.catch(error => console.log(error))
		},

		getProvinceFacilities(){
			axios
				.get(`https://fema-backend.herokuapp.com/fema/provinceprov/${this.filterProvince}`)
				.then(data => {
					this.facilities= data.data
				})
				.catch(error => console.log(error))
		},

		getProvServFacilities(){
			axios
				.get(`https://fema-backend.herokuapp.com/fema/filterfacilities/${this.filterService}/${this.filterProvince}`)
				.then(data => {
					this.facilities= data.data
				})
				.catch(error => console.log(error))
		},

		callFacilityFunction(){
			if(this.filterProvince == 'all' && this.filterService == 'all'){
				this.getFacilities()
			}else if(this.filterProvince == 'all' && !(this.filterService == 'all')){
				this.getServiceFacilities()
			}else if(!(this.filterProvince == 'all') && this.filterService == 'all'){
				this.getProvinceFacilities()
			}else{
				this.getProvServFacilities()
			}
		},

		getCurrentFacility(e){
			this.currentFacility = e.target.getAttribute('id')
		},

		getUpdateFacility(e){
			this.currentFacility = e.target.getAttribute('data-facility')
		},

		getBookingStatus(e){
			this.bookingStatus = e.target.getAttribute('value')
		},

		getBookingId(e){
			this.bookingId = e.target.getAttribute('id')
		},

		deleteConfirmation(){
			this.isDeletingBooking = true
			this.nextStep = false
		},

		deleteBooking(){
			axios
				.delete(`https://fema-backend.herokuapp.com/fema/userbookings/${this.bookingId}`)
				.then(() => {
					this.showUserBookings()
					this.nextStep = true
					this.isDeletingBooking = false
					this.isEditingBooking = false
					this.isCheckingDetails = false
					
				})
				.catch(error => {
					console.log(error)
				})
		},

		updateBooking(){
			this.nextStep = true
			this.isDeletingBooking = false
			this.isEditingBooking = false
			this.isCheckingDetails = false
		},

		editConfirmation(){
			this.isEditingBooking = true
			this.nextStep = false
		},

		changeBookingStatus(){
			axios
				.post(`https://fema-backend.herokuapp.com/fema/bookings/${this.bookingId}`, {
					status: this.bookingStatus
				}).then(() => {
					this.bookingFeedback = 'Booking has been ' + this.bookingStatus + ' successfully.'
					setTimeout(() => {
						this.bookingFeedback = ''
					}, 2000);
				})

		},

		login() {
			this.user.loginEmail
			this.user.loginPassword
			axios
				.post(`https://fema-backend.herokuapp.com/fema/login`, {
					email: this.user.loginEmail,
					password: this.user.loginPassword,
				})
				.then(data => {
					console.log(data)
					this.showUserBookings()
				})
				.then(() => {
					this.loginAuthError = "Login successful, redirecting!";
					setTimeout(() => {
						this.loginAuthError = "";
						this.userAccess = false;
						this.showUserScreen = true;
						this.showFacilityScreen = false
					}, 2000);
				})
				.catch((error) => {
					console.log(error);
					this.loginAuthError = "Invalid email or password";
					this.user.loginEmail = "";
					this.user.loginPassword = "";
				});
		},

		makeBooking() {
			this.isbooking = true;
			this.showAllElems = false;
		},

		getServices(){
			axios
			.get(`https://fema-backend.herokuapp.com/fema/services/${this.currentFacility}`)
			.then(data => {
				this.serviceList = data.data.data
			})
		},

		getAllServices(){
			axios
				.get(`https://fema-backend.herokuapp.com/fema/services`)
				.then(data => {
					this.allServices = data.data
				})
		},

		

		saveBooking(){
			axios
			.post(`https://fema-backend.herokuapp.com/fema/makebooking`, {
				email: this.getCurrentUser(),
				facilityName: this.currentFacility,
				date: this.bookingDate,
				time: this.bookingTime,
				serviceId: this.chosenService
			})
			.then(data => {
				this.showUserBookings()
				this.cancelBookingForm()
			})
			.catch(error => {
				console.log(error)
			})
		},

		saveUpdatedBooking(){
			axios
				.put(`https://fema-backend.herokuapp.com/fema/userbookings/${this.bookingId}`, {
					date: this.updateBookingDate,
					time: this.updateBookingTime,
					serviceId: this.updateService
				})
				.then(() => {
					this.showUserBookings()
					this.bookingFeedback = 'Booking updated successfully'
					setTimeout(() => {
						this.bookingFeedback = ''
					}, 2000);
				})
				.catch(error => console.log(error))
		},

		cancelBookingForm(){
			this.isbooking = false
			this.showAllElems = true
		},

		cancelUpdateBookingForm(){
			this.isCheckingDetails = false
			this.isEditingBooking = false
			this.nextStep = true
		},

	
		getCurrentUser(){
			return this.user.loginEmail
		},

		getLoggedInFac(){
			return this.facility.logFacEmail
		},

		register() {
			axios
				.post(`https://fema-backend.herokuapp.com/fema/register`, {
					password: this.user.password,
					email: this.user.email,
					full_name: this.user.name,
				})
				.then(() => {
					this.signUpAuthError = "New user created! Please login";

					setTimeout(() => {
						this.signUpAuthError = "";
					}, 3000);
					this.user.password = "";
					this.user.email = "";
					this.user.name = "";
				})
				.catch((error) => {
					alert(error);
				});
		},
		registerFacility() {
			axios
				.post(`https://fema-backend.herokuapp.com/fema/registerFacility`, {
					facName: this.facility.facName,
					facReg: this.facility.reg,
					capacity: this.facility.capacity,
					city: this.facility.city,
					province: this.facility.province,
					contactno: this.facility.contactno,
					email: this.facility.facEmail,
					password: this.facility.facPassword,
					services: this.facility.services,
				})
				.then(() => {
					this.facAuthError = "Facility Registered! Please Login";

					setTimeout(() => {
						this.facAuthError = "";
					}, 3000);
					this.facility.facName = "";
					this.facility.location = "";
					this.facility.reg = "";
					this.facility.capacity = "";
					this.facility.contactno = "";
					this.facility.facEmail = "";
					this.facility.facPassword = "";
				})
				.catch((error) => {
					alert(error)
				});
		},
		loginFacility() {
			axios
				.post(`https://fema-backend.herokuapp.com/fema/loginFacility`, {
					facilityEmail: this.facility.logFacEmail,
					facilityPass: this.facility.logFacPassword,
				})
				.then(() => {
					this.showFacilityBookings()
				})
				.then(() => {
					this.logFacAuthError = "Facility Login successful, redirecting!"
					setTimeout(() => {
						this.logFacAuthError = ""
						this.userAccess = false
						this.showFacSec = true
						this.showFacilityScreen = true
						this.showUserScreen = false
					}, 2000);
					
				})
				.catch((error) => {
					this.facility.logFacEmail = ""
					this.facility.logFacPassword = ""
					console.log(error)
					this.logFacAuthError = "Invalid email or password"
				});
		},
		logoutUser() {
			this.showUserScreen = false;
			this.userAccess = true;
		},
		logoutFacility() {
			this.showFacilityScreen = false;
			this.showFacSec = false;
		},

		showUserBookings(){
			axios
			.get(`https://fema-backend.herokuapp.com/fema/userbookings/${this.getCurrentUser()}`)
			.then(data => {
					this.userBookingList = data.data.bookings
			})
			.catch(error => {
				console.log(error)
			})
		},

		showFacilityBookings(){
			axios
			.get(`https://fema-backend.herokuapp.com/fema/facilitybookings/${this.getLoggedInFac()}`)
			.then(data => {
					this.facilityBookingList = data.data.data
					console.log(this.facilityBookingList)
			})
			.catch(error => {
				console.log(error)
			})
		},
	};
});

Alpine.start();
