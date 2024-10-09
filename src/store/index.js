import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";
import { make } from "vuex-pathify";
import functions from '@/plugins/functions'

pathify.options.mapping = "simple";

const getDefaultState = () => ({
  formDate: `${functions.getSysDate().format.substring(0,6)}01`,
  toDate: functions.getSysDate().format,
  manualPDF: false,
  DateDisibled: false,
  flagGetTruckQueue: false,
  detailTruckQueue:  {
      dialogDetail: false,
      itemDataTable: [],
      purchaseOrder: '',
      vendorNo: '',
      planDate: '',
      vendorDesc: '',
      status: '',
      driverName: '',
      driverPhone: '',
      plate: '',
      checkIn: '',
      checkOut:'',
      remark: ''
     }
  
});
const loginInfo = () => ({
  drawer: true,
  toggle: true,
  headerProject: 'TRUCK QUEUE',
  selectedIndexStr: 1,
  imageProfile: "",
  EndpointPortal: 'https://portal.ip-one.com',
  Endpoint: 'https://portal.ip-one.com/ApiTruckQueue',
  // Endpoint: 'https://localhost:44333',
  infoLogin: {
    isLogin: false,
    authentication: false,
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    empId: '',
    locked: false,
    group:[],
    samAccount: ''
  },
})
const state = Object.assign(getDefaultState(), loginInfo());

const mutations = make.mutations(state);
const resetMutation = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

Object.assign(mutations, resetMutation);

const actions = make.actions(state);
const getters = make.getters(state);

Vue.use(Vuex);

// create store
export default new Vuex.Store({
  modules: {},
  plugins: [pathify.plugin],
  state,
  mutations,
  actions,
  getters,
});
