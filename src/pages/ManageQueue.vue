<template>
  <div style="margin: 1rem">
    <v-layout row wrap>
      <v-flex md2 xs9 sm4>
        <calendar
          :value.sync="formDate"
          label="Start Date"
          :readonly="true"
          :disabled="DateDisibled"
        />
      </v-flex>
      <div style="margin-left: 3rem; margin-top: 1rem; font-weight: bold">TO</div>
      <v-flex md2 xs9 sm4>
        <calendar
          :value.sync="toDate"
          label="Current Date"
          :disabled="DateDisibled"
          :readonly="true"
        />
      </v-flex>
      <v-flex style="margin-left: 2rem">
        <v-tooltip top color="teal" v-if="!DateDisibled">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="#007fc4"
              dark
              class="small-btn mt-2"
              v-bind="attrs"
              v-on="on"
              @click="searchTruckQueue(formDate, toDate)"
            >
              <v-icon size="20">mdi-magnify</v-icon>
            </v-btn>
          </template>
          <span>Search</span>
        </v-tooltip>
        <v-tooltip top color="teal" v-if="DateDisibled">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="#007fc4"
              dark
              class="small-btn mt-2"
              v-bind="attrs"
              v-on="on"
              @click="resetSearch"
            >
              <v-icon size="20">mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Clear</span>
        </v-tooltip>
      </v-flex>
      <v-layout
        justify-end
        v-if="
          ['TruckQueue_Planning'].some((i) => infoLogin.group.includes(i)) ||
          ['TruckQueue_Admin'].some((i) => infoLogin.group.includes(i))
        "
      >
        <v-tooltip top color="teal">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="#007fc4"
              dark
              class="small-btn mt-3"
              v-bind="attrs"
              v-on="on"
              @click="(dialogAddTruckQueue = true), clearField()"
            >
              <v-icon size="20">mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Add Queue</span>
        </v-tooltip>
        <v-tooltip top color="teal" v-if="selected.length > 0">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="
                ['TruckQueue_Planning'].some((i) => infoLogin.group.includes(i)) ||
                ['TruckQueue_Admin'].some((i) => infoLogin.group.includes(i))
              "
              fab
              small
              color="green"
              dark
              class="extra-small-btn mt-3"
              v-bind="attrs"
              v-on="on"
              @click="confirmTruckQueue('CONFIRMED')"
            >
              <v-icon size="20">mdi-cloud-check-variant-outline</v-icon>
            </v-btn>
          </template>
          <span>Confirm</span>
        </v-tooltip>
      </v-layout>
    </v-layout>

    <v-layout row wrap v-if="DateDisibled">
      <v-flex xs12 sm5 md4>
        <v-autocomplete
          solo
          v-model="mFilterStatus"
          :items="StatusItem"
          item-value="key"
          item-text="text"
          dense
          label="Status"
          return-object
          hide-details
          multiple
        ></v-autocomplete>
      </v-flex>

      <v-spacer></v-spacer>
      <v-flex xs12 sm5 md4>
        <v-text-field
          v-model="search"
          flat
          label="Search"
          prepend-inner-icon="search"
          solo
          dense
          hide-details
          clearable
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-toolbar
      style="margin-top: 0.5rem"
      xs12
      sm8
      color="#f8c849"
      dark
      tabs
      v-if="dataTruckQueue.length == 0"
    >
      <v-layout justify-center style="font-size: larger"> no data available </v-layout>
    </v-toolbar>
    <v-data-table
      style="margin-top: 0.5rem"
      v-if="dataTruckQueue.length > 0"
      v-model="selected"
      :headers="headers"
      :items="dataTruckQueue"
      item-key="index"
      select-all
      :search="search"
      :pagination.sync="pagination"
      :rows-per-page-items="rowsPerPageItem"
    >
      <template v-slot:headers="props">
        <tr>
          <th style="background: #dbdbdb !important">
            <v-checkbox
              :input-value="props.all"
              :indeterminate="props.indeterminate"
              primary
              hide-details
              @click.stop="toggleAll"
            ></v-checkbox>
          </th>
          <th
            v-for="header in props.headers"
            :key="header.text"
            @click="header.sortable && sort(header.value)"
          >
            {{ header.text }}
            <v-icon
              style="color: white; font-size: 12px"
              v-if="pagination.sortBy === header.value && header.sortable"
            >
              {{ pagination.descending ? "arrow_downward" : "arrow_upward" }}
            </v-icon>
          </th>
        </tr>
      </template>
      <template v-slot:items="props">
        <tr>
          <td
            style="background: #dbdbdb !important"
            v-if="!getDisabled(props.item.status)"
          >
            <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
          </td>
          <td
            style="background: #dbdbdb !important"
            v-else-if="getDisabled(props.item.status)"
          ></td>
          <td class="text-xs-left">
            {{ functions.formatDateFormat(props.item.planDate) }}
          </td>
          <td class="text-xs-left">
            {{ props.item.purchaseOrderNo }}
          </td>
          <td class="text-xs-left">{{ props.item.vendorNo }}</td>
          <td class="text-xs-left">{{ props.item.vendorDesc }}</td>
          <td class="text-xs-left">
            {{ props.item.timeStart }}
          </td>
          <td class="text-xs-left">
            {{ props.item.timeEnd }}
          </td>
          <td class="text-xs-left">
            {{ props.item.status }}
          </td>

          <v-btn
            color="#007fc4"
            fab
            small
            class="extra-small-btn"
            @click="getPurchaseOrder(props.item)"
          >
            <v-icon style="margin-top: 0.1rem; color: white">mdi-list-box-outline</v-icon>
          </v-btn>
          <v-btn
            v-if="
              (['TruckQueue_Planning'].some((i) => infoLogin.group.includes(i)) &&
                props.item.status != 'ACCEPTED') ||
              ['TruckQueue_Admin'].some((i) => infoLogin.group.includes(i))
            "
            color="red"
            fab
            small
            class="extra-small-btn"
            @click="DeleteTruckQueue(props.item)"
          >
            <v-icon style="margin-top: 0.1rem; color: white">mdi-delete</v-icon>
          </v-btn>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogAddTruckQueue" persistent max-width="700px">
      <v-card>
        <v-card-title style="background: #007fc4; color: white; font-size: large">
          {{ editMode == false ? "Add" : "Edit" }} Truck Queue
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex md5 xs12>
              <calendar :value.sync="fDate" label="Plan Date" :readonly="true" />
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex md6 xs12>
              <v-text-field
                v-model="fPurchasing"
                prepend-icon="mdi-invoice-list-outline"
                @keydown.native="keyFilter($event, 'number')"
                label="Purchasing Order"
                maxlength="10"
                prefix="*"
                hide-details
                style="color: red"
              ></v-text-field>
            </v-flex>

            <v-flex md6 xs12>
              <v-text-field
                v-model="fVendor"
                prepend-icon="mdi-account-sync-outline"
                @keydown.native="keyFilter($event, 'number')"
                label="Vendor No"
                maxlength="7"
                prefix="*"
                hide-details
                style="color: red"
              ></v-text-field>
            </v-flex>

            <v-flex md6 xs12>
              <v-text-field
                prefix="*"
                style="color: red"
                prepend-icon=" "
                :disabled="true"
                v-model="fVendorName"
                label="Vendor Name"
                hide-details
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout wrap style="margin-top: 1rem">
            <v-flex md6 xs12>
              <v-layout>
                <div style="margin-left: 2rem; margin-top: 0.5rem">Time Start</div>
                <v-spacer></v-spacer>
                <timepicker v-model="selectedTimeStart" ref="timeStartRef" />
              </v-layout>
            </v-flex>
            <v-flex md6 xs12>
              <v-layout>
                <div style="margin-left: 2rem; margin-top: 0.5rem">Time End</div>
                <v-spacer></v-spacer>
                <timepicker v-model="selectedTimeEnd" ref="timeEndRef" />
              </v-layout>
            </v-flex>
          </v-layout>
          <v-flex xs12 sm12 md12 style="margin-top: 1rem">
            <v-textarea
              v-model="fRemark"
              prepend-icon="mdi-note-text-outline"
              maxlength="250"
              counter="250"
              label="Remark"
              solo
            ></v-textarea>
          </v-flex>
        </v-card-text>
        <!-- <hr style="border: 0px; border-top: 0.5px solid #007fc4" /> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            class="white--text"
            text
            style="border-radius: 12px"
            @click="submitTruckQueue"
            >Submit</v-btn
          >
          <v-btn
            flat
            color="#007fc4"
            style="border-radius: 12px"
            @click="(dialogAddTruckQueue = false), clearField()"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="detailTruckQueue.dialogDetail" persistent max-width="1080px">
      <v-card>
        <v-card-title style="background: #007fc4; color: white; font-size: large">
          Detail Truck Queue
        </v-card-title>
        <v-card-text>
          <detail-manage-queue></detail-manage-queue>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            color="#007fc4"
            style="border-radius: 12px"
            @click="detailTruckQueue.dialogDetail = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar color="orange" v-model="showResult" :timeout="3500">
      {{ msgResult }}
    </v-snackbar>
    <div v-if="loadingDialog">
      <Loading :value="loadingDialog" />
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";
import { sync } from "vuex-pathify";
import functions from "@/plugins/functions";
import calendar from "@/components/DatePiker.vue";
import Loading from "@/components/core/Loading";
import keyFilter from "@/plugins/keyFilter";
import timepicker from "@/components/TimePicker.vue";
import { isEmpty } from "lodash";
import DetailManageQueue from "@/pages/DetailManageQueue/DetailManageQueue";

export default {
  components: {
    calendar,
    Loading,
    timepicker,
    DetailManageQueue,
  },
  data() {
    return {
      StatusItem: [
        { key: 1, text: "PLANED" },
        { key: 2, text: "CONFIRMED" },
        { key: 3, text: "ACCEPTED" },
        { key: 4, text: "TIMEOUT" },
      ],
      mFilterStatus: "",
      search: "",
      showResult: false,
      msgResult: "",
      loadingDialog: false,
      dialogAddTruckQueue: false,
      fDate: functions.getSysDate().format,
      editMode: false,
      fPurchasing: "",
      fRemark: "",
      fVendor: "",
      fVendorName: "",
      selectedTimeStart: "00:00",
      selectedTimeEnd: "00:00",
      selected: [],
      dataTruckQueue: [],
      functions,
      keyFilter,
      pagination: {
        sortBy: "planID",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        totalItems: 0,
      },
      rowsPerPageItem: [
        { text: "10", value: 10 },
        { text: "20", value: 20 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
      ],
      headers: [
        {
          text: "Plan Date",
          align: "left",
          sortable: true,
          value: "planID",
        },
        {
          text: "PurchaseOrder",
          align: "left",
          sortable: true,
          value: "purchaseOrderNo",
        },
        {
          text: "Vendor No",
          align: "left",
          sortable: true,
          value: "vendorNo",
        },
        {
          text: "Description",
          align: "left",
          sortable: false,
          value: "vendorDesc",
        },
        { text: "Time Start", align: "left", sortable: false, value: "timeStart" },
        { text: "Time End", align: "left", sortable: false, value: "timeEnd" },

        { text: "Status", align: "left", sortable: true, value: "status" },
        { text: "Action", align: "left", sortable: false, value: "Action" },
      ],

      hours: 0,
      minutes: 0,
      rawData: [],
    };
  },
  async created() {
    this.$store.commit("resetState");
  },
  watch: {
    fVendor(val) {
      if (val.length <= 6) return (this.fVendorName = "");
      this.GetVendor(val);
    },
    fPurchasing(val) {
      if (val.length <= 9) return;
      this.GetPurchasing(val);
    },
    flagGetTruckQueue(val) {
      if (val && this.DateDisibled)
        return this.searchTruckQueue(this.formDate, this.toDate);
    },
    mFilterStatus() {
      this.dataTruckQueue = []
      if (this.mFilterStatus.length == 0) return (this.dataTruckQueue = this.rawData);
      let statusArray = this.mFilterStatus.map((item) => item.text);
      this.rawData.forEach((item) => {
        if (statusArray.includes(item.status)) {
          this.dataTruckQueue.push(item);
        }
      });
    },
  },
  computed: {
    ...sync("*"),
  },
  mounted() {
    if (this.value) {
      const [hours, minutes] = this.value.split(":");
      this.hours = parseInt(hours);
      this.minutes = parseInt(minutes);
    }
  },
  methods: {
    async GetPurchasing(purchaseOrder) {
      this.loadingDialog = true;
      const response = await axios.get(
        `${this.Endpoint}/TruckQueue/v1/GetPurchasing?PurchaseOrder=${purchaseOrder}`
      );
      if (response.data.status == 200) {
        this.loadingDialog = false;
        this.fVendor = response.data.results[0].vendorNo;
      } else if (response.data.status == 404) {
        this.loadingDialog = false;
        Swal.fire({
          text: `${response.data.message}`,
          icon: "warning",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "Ok",
        });
      } else {
        this.loadingDialog = false;
        Swal.fire({
          text: `Internal Server Error`,
          icon: "error",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "Ok",
        });
      }
    },
    async GetVendor(vendor) {
      this.loadingDialog = true;
      const response = await axios.get(
        `${this.Endpoint}/TruckQueue/v1/GetVendor?vendor=${vendor}`
      );
      if (response.data.status == 200) {
        this.loadingDialog = false;
        this.fVendorName = response.data.results[0].vendorDesc;
      } else if (response.data.status == 404) {
        this.loadingDialog = false;
        Swal.fire({
          text: `${response.data.message}`,
          icon: "warning",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "Ok",
        });
      } else {
        this.loadingDialog = false;
        Swal.fire({
          text: `Internal Server Error`,
          icon: "error",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "Ok",
        });
      }
    },
    submitTruckQueue() {
      if (isEmpty(this.fPurchasing)) {
        this.showResult = true;
        return (this.msgResult = "Purchasing order can't be null.");
      }
      if (isEmpty(this.fVendor)) {
        this.showResult = true;
        return (this.msgResult = "Vendor no can't be null.");
      }
      if (isEmpty(this.fVendorName)) {
        this.showResult = true;
        return (this.msgResult = "Vendor name can't be null.");
      }
      Swal.fire({
        text: `Would you like to proceed with saving the data into the system?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "Ok",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const elementJson = [
            {
              PurchaseOrderNo: this.fPurchasing.toString(),
              PlanDate: this.fDate.toString(),
              VendorNo: this.fVendor.toString(),
              TimeStart: this.selectedTimeStart.toString(),
              TimeEnd: this.selectedTimeEnd.toString(),
              Remark: this.fRemark,
              Createby: this.infoLogin.empId,
            },
          ];

          const response = await axios.post(
            ` ${this.Endpoint}/TruckQueue/v1/InsertPlanQueue`,
            elementJson
          );
          if (response.data.status == 200) {
            this.loadingDialog = false;
            Swal.fire({
              text: `Successfully`,
              icon: "success",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonColor: "#0c80c4",
              cancelButtonColor: "#C0C0C0",
              confirmButtonText: "Ok",
            }).then(async (result) => {
              if (result.isConfirmed) {
                this.clearField();
                this.dialogAddTruckQueue = false;
                this.dataTruckQueue = [];
                this.rawData = [];
                this.pagination.rowsPerPage = 10;
                this.selected = [];
                this.flagGetTruckQueue = true;
              }
            });
          } else {
            this.loadingDialog = false;
            Swal.fire({
              text: `Internal Server Error`,
              icon: "error",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonColor: "#0c80c4",
              cancelButtonColor: "#C0C0C0",
              confirmButtonText: "Ok",
            });
          }
        }
      });
    },
    pad(number) {
      return number < 10 ? "0" + number : number;
    },
    updateTime() {
      this.$emit("input", `${this.pad(this.hours)}:${this.pad(this.minutes)}`);
    },
    getDisabled(val) {
      if (!["PLANNED"].includes(val)) {
        return true;
      }
    },
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else
        this.dataTruckQueue.forEach((item) => {
          if (["PLANNED"].includes(item.status.trim())) {
            this.selected.push(item);
          }
        });
    },
    sort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    async searchTruckQueue(startDate, endDate) {
      this.dataTruckQueue = [];
      this.rawData = [];
      this.loadingDialog = true;
      this.flagGetTruckQueue = false;
      let pTruckQueueDate = {
        planDateStart: startDate,
        planDateEnd: endDate,
      };
      const response = await axios.post(
        `${this.Endpoint}/TruckQueue/v1/GetPlanQueue`,
        pTruckQueueDate
      );
      if (response.data.status == 200) {
        this.loadingDialog = false;
        this.DateDisibled = true;
        const Role = ["TruckQueue_Vendor"].some((i) => this.infoLogin.group.includes(i));
        if (Role) {
          const dataFilter = response.data.results.filter(
            (result) => result.vendorNo == this.infoLogin.empId
          );
          dataFilter.forEach((element, index) =>
            this.rawData.push({
              index: index + 1,
              planID: element.planID,
              planDate: element.planDate,
              vendorNo: element.vendorNo,
              vendorDesc: element.vendorDesc,
              timeEnd: element.timeEnd,
              timeStart: element.timeStart,
              remark: element.remark,
              createBy: element.createBy,
              updateBy: element.updateBy,
              status: element.status,
              purchaseOrderNo: element.purchaseOrderNo,
              driverName: element.driverName,
              driverPhone: element.driverPhone,
              plate: element.plate,
              checkIn: element.checkIn,
              checkOut: element.checkOut,
            })
          );
          this.dataTruckQueue = this.rawData;
        } else {
          response.data.results.forEach((element, index) =>
            this.rawData.push({
              index: index + 1,
              planID: element.planID,
              planDate: element.planDate,
              vendorNo: element.vendorNo,
              vendorDesc: element.vendorDesc,
              timeEnd: element.timeEnd,
              timeStart: element.timeStart,
              remark: element.remark,
              createBy: element.createBy,
              updateBy: element.updateBy,
              status: element.status,
              purchaseOrderNo: element.purchaseOrderNo,
              driverName: element.driverName,
              driverPhone: element.driverPhone,
              plate: element.plate,
              checkIn: element.checkIn,
              checkOut: element.checkOut,
            })
          );
          this.dataTruckQueue = this.rawData;
        }
      } else if (response.data.status == 404) {
        this.loadingDialog = false;
        Swal.fire({
          text: `${response.data.message}`,
          icon: "warning",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "Ok",
        });
      } else {
        this.loadingDialog = false;
        Swal.fire({
          text: `Internal Server Error`,
          icon: "error",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "Ok",
        });
      }
    },
    clearField() {
      this.fDate = functions.getSysDate().format;
      this.fPurchasing = "";
      this.fRemark = "";
      this.fVendor = "";
      this.fVendorName = "";
      this.driverName = "";
      this.driverPhone = "";
      this.selectedTimeStart = "00:00";
      this.selectedTimeEnd = "00:00";
      this.$refs.timeStartRef.clearTime();
      this.$refs.timeEndRef.clearTime();
    },
    resetSearch() {
      this.DateDisibled = false;
      this.dataTruckQueue = [];
      this.pagination.rowsPerPage = 10;
      this.selected = [];
    },
    async DeleteTruckQueue(item) {
      Swal.fire({
        html: `Would you like to proceed with deleting the record with the following details? <br>
        Plan Date: <strong> ${functions.formatDateFormat(item.planDate)}</strong> <br>
        Start Time: <strong> ${item.timeStart}</strong> <br>
        End Time: <strong> ${item.timeEnd}</strong> ?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loadingDialog = true;
          const DelTruckQueue = {
            PlanID: item.planID,
          };
          const response = await axios.post(
            `${this.Endpoint}/TruckQueue/v1/DeleteTruckQueue`,
            DelTruckQueue
          );
          if (response.data.status == 200) {
            this.loadingDialog = false;
            Swal.fire({
              html: `Successfully`,
              icon: "success",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonColor: "#0c80c4",
              cancelButtonColor: "#C0C0C0",
              confirmButtonText: "OK",
            }).then(async (result) => {
              if (result.isConfirmed) {
                this.dataTruckQueue = [];
                this.pagination.rowsPerPage = 10;
                this.selected = [];
                this.flagGetTruckQueue = true;
              }
            });
          } else {
            this.loadingDialog = false;
            Swal.fire({
              text: `Internal Server Error`,
              icon: "error",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonColor: "#0c80c4",
              cancelButtonColor: "#C0C0C0",
              confirmButtonText: "Ok",
            });
          }
        }
      });
    },
    async getPurchaseOrder(item) {
      const response = await axios.get(
        `${this.Endpoint}/TruckQueue/v1/GetPurchasing?PurchaseOrder=${item.purchaseOrderNo}`
      );
      if (response.data.status == 200) {
        this.loadingDialog = false;
        this.detailTruckQueue.dialogDetail = true;
        this.detailTruckQueue.purchaseOrder = item.purchaseOrderNo;
        this.detailTruckQueue.vendorNo = item.vendorNo;
        this.detailTruckQueue.vendorDesc = item.vendorDesc;
        this.detailTruckQueue.planDate = item.planDate;
        this.detailTruckQueue.status = item.status;
        this.detailTruckQueue.driverName = item.driverName;
        this.detailTruckQueue.driverPhone = item.driverPhone;
        this.detailTruckQueue.plate = item.plate;
        this.detailTruckQueue.checkIn = item.checkIn;
        this.detailTruckQueue.checkOut = item.checkOut;
        this.detailTruckQueue.itemDataTable = response.data.results;
      } else if (response.data.status == 404) {
        this.loadingDialog = false;
        Swal.fire({
          text: `${response.data.message}`,
          icon: "warning",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "Ok",
        });
      } else {
        this.loadingDialog = false;
        Swal.fire({
          text: `Internal Server Error`,
          icon: "error",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "Ok",
        });
      }
    },
    async confirmTruckQueue(status) {
      Swal.fire({
        text: `Would you like to confirm the saving of data into the system?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "Ok",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let elementJson = [];
          if (["TruckQueue_Admin"].some((i) => this.infoLogin.group.includes(i))) {
            for (let i = 0; i < this.selected.length; i++) {
              const element = {
                purchaseOrderNo: this.selected[i].purchaseOrderNo,
                planDate: this.selected[i].planDate,
                vendorNo: this.selected[i].vendorNo,
                updateBy: this.infoLogin.empId,
                plate: "",
                driverName: "",
                driverPhone: "",
                status: status,
              };
              elementJson.push(element);
            }
          }
          const response = await axios.post(
            ` ${this.Endpoint}/TruckQueue/v1/UpdateTruckQueue`,
            elementJson
          );
          if (response.data.status == 200) {
            this.loadingDialog = false;
            Swal.fire({
              text: `Successfully`,
              icon: "success",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonColor: "#0c80c4",
              cancelButtonColor: "#C0C0C0",
              confirmButtonText: "Ok",
            }).then(async (result) => {
              if (result.isConfirmed) {
                this.clearField();
                this.dataTruckQueue = [];
                this.pagination.rowsPerPage = 10;
                this.selected = [];
                this.flagGetTruckQueue = true;
              }
            });
          } else {
            this.loadingDialog = false;
            Swal.fire({
              text: `Internal Server Error`,
              icon: "error",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonColor: "#0c80c4",
              cancelButtonColor: "#C0C0C0",
              confirmButtonText: "Ok",
            });
          }
        }
      });
    },
  },
};
</script>
<style scoped>

.extra-small-btn {
  width: 30px !important;
  height: 30px !important;
  min-width: 30px !important;
  min-height: 30px !important;
}
</style>
