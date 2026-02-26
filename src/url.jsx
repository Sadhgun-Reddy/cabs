import { Edit, Search } from "react-feather"
import AddVehicleGroup from "./feature-module/Service/addvehicleGroup"

const base_url = "http://88.222.213.67:5090/"


export const URLS = {

    GoogleMapsKey: "AIzaSyDOesNrafsTY5VzVYdMelzdFRPxLPMwh-I",

    Base: base_url,
    ImageUrl: base_url,

    AdminLogin: base_url + "v1/gkcabs/admin/auth/authLogin",
    GetProfile: base_url + "v1/gkcabs/admin/auth/getprofile",
    UpdateProfile: base_url + "v1/gkcabs/admin/auth/updateAdminProfile",

    // Zones 

    GetAllZones: base_url + "v1/gkcabs/admin/zone/getallzones",
    AddZone: base_url + "v1/gkcabs/admin/zone/addzone",
    EditZone: base_url + "v1/gkcabs/admin/zone/updatezone",
    GetZoneById: base_url + "v1/gkcabs/admin/zone/getzonebyid/",
    UpdateZoneStatus: base_url + "v1/gkcabs/admin/zone/updatezonestatus",

    // Airport Zones

    GetAllAirportZones: base_url + "v1/gkcabs/admin/zone/getallzones",
    AddAirportZone: base_url + "v1/gkcabs/admin/zone/addzone",
    EditAirportZone: base_url + "v1/gkcabs/admin/zone/updatezone",
    GetAirportZoneById: base_url + "v1/gkcabs/admin/zone/getzonebyid/",
    UpdateAirportZoneStatus: base_url + "v1/gkcabs/admin/zone/updatezonestatus",


    // Peak Zones

    GetAllPeakZones: base_url + "v1/gkcabs/admin/zone/getallzones",
    AddPeakZone: base_url + "v1/gkcabs/admin/zone/addzone",
    EditPeakZone: base_url + "v1/gkcabs/admin/zone/updatezone",
    GetPeakZoneById: base_url + "v1/gkcabs/admin/zone/getzonebyid/",
    UpdatePeakZoneStatus: base_url + "v1/gkcabs/admin/zone/updatezonestatus",

    // Service Categories

    GetAllServiceCategories : base_url + "v1/gkcabs/admin/servicetype/getallservicetypes",
    EditServiceCategory : base_url + "v1/gkcabs/admin/servicetype/editservicetype",
    UpdateServiceStatus : base_url + "v1/gkcabs/admin/servicetype/updateservicestatus",
    SearchServiceCategories : base_url + "v1/gkcabs/admin/servicetype/getallservicetypes?searchQuery=",
    GetServiceCategoryById : base_url + "v1/gkcabs/admin/fairplan/getservice-categorys",

    // Vehicle Groups

    GetAllVehicleGroup: base_url + "v1/gkcabs/admin/vechilegroup/getallvechilegroups",
    UpdateVehicleGroupStatus: base_url + "v1/gkcabs/admin/vechilegroup/updatestatus",
    AddVehicleGroup: base_url + "v1/gkcabs/admin/vechilegroup/addvechilegroup",
    EditVehicleGroup: base_url + "v1/gkcabs/admin/vechilegroup/editvechilegroup",
    GetVehicleGroupById: base_url + "v1/gkcabs/admin/vechilegroup/getvechilegroupbyid/",

    //Vehicle Model

    GetAllVehicleModel: base_url + "v1/gkcabs/admin/vechilemodel/getallvechilemodels",
    UpdateVehicleModelStatus: base_url + "v1/gkcabs/admin/vechilemodel/updatestatus",
    AddVehicleModel: base_url + "v1/gkcabs/admin/vechilemodel/addvechilemodel",
    EditVehicleModel: base_url + "v1/gkcabs/admin/vechilemodel/editvechilemodel",
    GetVehicleModelById: base_url + "v1/gkcabs/admin/vechilemodel/getvehiclebyid",

    // Fair Plans

    GetAllFairPlans : base_url + "v1/gkcabs/admin/fairplan/getallfairplans",
    AddFaiPlan : base_url + "v1/gkcabs/admin/fairplan/addfairplan",
    EditFarePlan : base_url + "v1/gkcabs/admin/fairplan/editfairplan",
    UpdateFairPlanStatus : base_url + "v1/gkcabs/admin/fairplan/updatestatus",
    GetServiceCategoryById : base_url + "v1/gkcabs/admin/fairplan/getservice-categorys",

    // Riders

    GetAllRiders : base_url + "v1/gkcabs/admin/docs/getusers",
    GetRiderById : base_url + "v1/gkcabs/admin/docs/getuserbyid",
    UpdateRiderStatus : base_url + "v1/gkcabs/admin/docs/updateuserstatus",
    GetRiderWallet : base_url + "v1/gkcabs/admin/wallets/getuserwallet",
    UpdateRiderWallet : base_url + "v1/gkcabs/admin/wallets/update-user-wallet",

    // Drivers

    GetAllDrivers : base_url + "v1/gkcabs/admin/docs/getdriversbykycstatus",
    GetDriverDocument : base_url + "v1/gkcabs/admin/docs/get-driver-documents",
    GetDriverDocumentById : base_url + "v1/gkcabs/admin/docs/get-driver-documents-byid",
    GetDriverById : base_url + "v1/gkcabs/admin/docs/get-driver-byid",
    UpdateDriverKycStatus : base_url + "v1/gkcabs/admin/docs/update-driver-kycstatus",
    UpdateDriverStatus : base_url + "v1/gkcabs/admin/docs/update-driver-status",

    // Driver Rules

    GetAllDriverRules : base_url + "v1/gkcabs/admin/driver-rules/getall",
    AddDriverRule : base_url + "v1/gkcabs/admin/driver-rules/add",
    EditDriverRule : base_url + "v1/gkcabs/admin/driver-rules/edit",

    // Tax Settings
    GetAllTax: base_url + "v1/gkcabs/admin/tax/getalltaxs",
    AddTax: base_url + "v1/gkcabs/admin/tax/addtax",
    EditTax: base_url + "v1/gkcabs/admin/tax/updatetax/",
    DeleteTax: base_url + "v1/gkcabs/admin/tax/deletetax/",
    UpdateTaxStatus: base_url + "v1/gkcabs/admin/tax/updatetaxstatus",

    // City Fair
    ViewCityFair: base_url + "v1/gkcabs/admin/cityfair/viewcityfair",
    EditCityFair: base_url + "v1/gkcabs/admin/cityfair/editcityfair",

}