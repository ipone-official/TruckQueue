<template>
  <div>
    <v-layout row wrap class="custom-layout">
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
          <v-card-text class="small-margin" ><strong>{{
            detailTruckQueue.status
          }}</strong></v-card-text>
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
              <td class="text-xs-left">{{ functions.numberWithCommas(props.item.quantity) }}</td>
              <td class="text-xs-left">{{ props.item.unit }}</td>
            </tr>
          </template>
        </v-data-table>
  </div>
</template>
<script>
import { sync } from "vuex-pathify";
import functions from "@/plugins/functions";

export default {
  data() {
    return { 
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
        { text: "Unit", align: "left", sortable: false, value: "timeEnd" }
      ],
    };
  },
  computed: {
    ...sync("*"),
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

.theme--light.v-table thead th {
  background-image: -webkit-gradient(
    linear,
    right top,
    left top,
    from(rgba(51, 148, 225, 0.18)),
    to(transparent)
  );
  background-image: linear-gradient(270deg, rgba(51, 148, 225, 0.18), transparent);
  background-color: #007fc4 !important;
  font-size: 15px !important;
  color: #ffffff !important;
  /* background-color: #222d32;
    background-color: #007fc4;
    background-color: #000000;
    background-color: #ffffff; */
}

.theme--light.v-datatable thead th.column.sortable.active,
.theme--light.v-datatable thead th.column.sortable.active .v-icon,
.theme--light.v-datatable thead th.column.sortable:hover {
  color: #ffffff !important;
}
</style>
