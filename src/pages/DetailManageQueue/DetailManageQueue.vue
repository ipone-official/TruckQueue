<template>
  <div>
    <v-layout
      justify-end
      v-if="
        (['TruckQueue_Vendor'].some((i) => infoLogin.group.includes(i)) &&
          detailTruckQueue.status == 'CONFIRMED') ||
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
            @click="acceptTruckQueue('ACCEPTED')"
          >
            <v-icon size="20">mdi-note-check-outline</v-icon>
          </v-btn>
        </template>
        <span>accept</span>
      </v-tooltip>
    </v-layout>
    <v-layout
      row
      wrap
      style="margin-top: -1rem"
      v-if="
        (['TruckQueue_Vendor'].some((i) => infoLogin.group.includes(i)) &&
          detailTruckQueue.status == 'CONFIRMED') ||
        ['TruckQueue_Admin'].some((i) => infoLogin.group.includes(i))
      "
    >
      <v-flex md4 xs12>
        <v-text-field
          v-model="driverName"
          prepend-icon="mdi-car"
          label="Driver Name"
          maxlength="100"
          prefix="*"
          hide-details
          style="color: red"
        ></v-text-field>
      </v-flex>
      <v-flex md4 xs12>
        <v-text-field
          v-model="plate"
          prepend-icon=" "
          @keydown.native="keyFilter($event, 'plate')"
          label="plate"
          maxlength="30"
          prefix="*"
          hide-details
          style="color: red"
        ></v-text-field>
      </v-flex>
      <v-flex md4 xs12>
        <v-text-field
          v-model="driverPhone"
          prepend-icon="mdi-phone-in-talk-outline"
          @keydown.native="keyFilter($event, 'number')"
          label="Driver Phone"
          prefix="*"
          mask="###-###-####"
          hide-details
          style="color: red"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="custom-layout mt-1">
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Purchase Order</v-card-title>
          <v-card-text class="small-margin">{{
            detailTruckQueue.purchaseOrder
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm2 md2 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Vendor</v-card-title>
          <v-card-text class="small-margin">{{ detailTruckQueue.vendorNo }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm4 md4 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Description</v-card-title>
          <v-card-text class="small-margin">{{
            detailTruckQueue.vendorDesc
          }}</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Status</v-card-title>
          <v-card-text class="small-margin"
            ><strong>{{ detailTruckQueue.status }}</strong></v-card-text
          >
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      class="custom-layout mt-1"
      v-show="detailTruckQueue.status == 'ACCEPTED'"
    >
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Driver Name</v-card-title>
          <v-card-text class="small-margin">{{
            detailTruckQueue.driverName
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm2 md2 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Plate</v-card-title>
          <v-card-text class="small-margin">{{ detailTruckQueue.plate }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm4 md4 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Driver Phone</v-card-title>
          <v-card-text class="small-margin">{{
            detailTruckQueue.driverPhone
          }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      class="custom-layout mt-1"
      v-show="detailTruckQueue.status == 'ACCEPTED'"
    >
      <v-flex xs12 sm3 md3 class="pa-0" v-if="detailTruckQueue.checkIn != ''">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Check-In</v-card-title>
          <v-card-text class="small-margin"
            ><strong>{{
              detailTruckQueue.checkIn == ""
                ? ""
                : functions.formatDateFormat(detailTruckQueue.checkIn)
            }}</strong></v-card-text
          >
        </v-card>
      </v-flex>
      <v-flex xs12 sm3 md3 class="pa-0" v-if="detailTruckQueue.checkOut != ''">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Check-Out</v-card-title>
          <v-card-text class="small-margin"
            ><strong>{{
              detailTruckQueue.checkOut == ""
                ? ""
                : functions.formatDateFormat(detailTruckQueue.checkOut)
            }}</strong></v-card-text
          >
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="custom-layout mt-1" v-if="detailTruckQueue.remark != ''">
      <v-flex xs12 sm12 md12 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Remark</v-card-title>
          <v-card-text class="small-margin"
            ><strong>{{ detailTruckQueue.remark }}</strong></v-card-text
          >
        </v-card>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="headers1"
      :items="detailTruckQueue.itemDataTable"
      :pagination.sync="pagination"
      :rows-per-page-items="rowsPerPageItem"
    >
      <template v-slot:items="props">
        <tr>
          <td>{{ functions.formatDateFormat(props.item.deliveryDate) }}</td>
          <td>{{ props.item.itemNo }}</td>

          <td class="text-xs-left">{{ props.item.materialCode }}</td>
          <td class="text-xs-left">{{ props.item.materialDesc }}</td>
          <td class="text-xs-left">
            {{ functions.numberWithCommas(props.item.quantity) }}
          </td>
          <td class="text-xs-left">{{ props.item.unit }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-snackbar color="orange" v-model="showResult" :timeout="3500">
      {{ msgResult }}
    </v-snackbar>
  <div v-if="loadingDialog">
      <Loading :value="loadingDialog" />
    </div>
  </div>
</template>
<script>
import { sync } from "vuex-pathify";
import functions from "@/plugins/functions";
import { isEmpty } from "lodash";
import Loading from "@/components/core/Loading";
import keyFilter from "@/plugins/keyFilter";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      loadingDialog: false,
      keyFilter,
      showResult: false,
      msgResult: "",
      driverName: "",
      plate: "",
      driverPhone: "",
      functions,
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
      headers1: [
        {
          text: "Delivery Date",
          align: "left",
          sortable: true,
          value: "planID",
        },
        {
          text: "Item No",
          align: "left",
          sortable: true,
          value: "purchaseOrderNo",
        },
        {
          text: "Material No",
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
        { text: "Quantity", align: "left", sortable: false, value: "timeStart" },
        { text: "Unit", align: "left", sortable: false, value: "timeEnd" },
      ],
    };
  },
  computed: {
    ...sync("*"),
  },
  methods: {
    async acceptTruckQueue(status) {
      if (isEmpty(this.driverName)) {
        this.showResult = true;
        return (this.msgResult = "Driver name can't be null.");
      }
      if (isEmpty(this.plate)) {
        this.showResult = true;
        return (this.msgResult = "Plate can't be null.");
      }
      if (isEmpty(this.driverPhone)) {
        this.showResult = true;
        return (this.msgResult = "Driver name can't be null.");
      }
      Swal.fire({
        text: `Would you like to accept the saving of data into the system?`,
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
              purchaseOrderNo: this.detailTruckQueue.purchaseOrder,
              planDate: this.detailTruckQueue.planDate,
              vendorNo: this.detailTruckQueue.vendorNo,
              updateBy: this.infoLogin.empId,
              plate: this.plate,
              driverName: this.driverName,
              driverPhone: this.driverPhone,
              status: status,
            },
          ];
          this.loadingDialog = true;
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
                this.driverName = "";
                this.driverPhone = "";
                this.plate = "";
                this.flagGetTruckQueue = true;
                this.detailTruckQueue.dialogDetail = false;
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
.custom-tab {
  color: white !important; /* ตัวหนังสือสีขาว */
}

.custom-slider {
  height: 4px !important; /* ปรับความหนาเส้นด้านล่าง */
}
.custom-title {
  color: #007fc4;
  font-weight: bold;
  font-size: 1.1rem;
}

.custom-layout {
  margin-bottom: 0.25rem; /* ลดช่องว่างระหว่าง v-layout */
}

.pa-0 {
  padding: 0 !important; /* เอา padding รอบ ๆ ช่องออก */
}

.small-margin {
  margin-bottom: -1.5rem !important; /* ลดช่องว่างด้านล่างของข้อความ */
  margin-top: -1.5rem !important; /* ลดช่องว่างด้านบนของข้อความ */
}

.small-card {
  padding: 0.5rem !important; /* ลด padding ภายใน card */
  font-size: 0.9rem; /* ลดขนาดฟอนต์ใน card */
}
.custom-hr {
  border: none;
  border-top: 0.2rem solid #007fc4; /* เปลี่ยนสีของเส้น */
  margin: 1rem 0; /* ปรับระยะห่างของเส้น */
}
.custom-autocomplete .v-input__prefix {
  color: red;
}
.custom-autocomplete .v-input__slot {
  color: red;
}
</style>
