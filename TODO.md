# TODO: Convert Property Listing to Heavy Vehicles Listing

## Tasks
- [ ] Update shared/schema.ts: Rename fields (bedrooms->owners, bathrooms->wheels, sqft->yearOfManufacture), remove "Land" type, add contactNumber field
- [ ] Update client/src/components/listing-form-modal.tsx: Rename field labels/inputs, remove "Land" option, add contact number input
- [ ] Update client/src/components/listing-card.tsx: Rename displayed fields to owners, wheels, year of manufacture
- [ ] Update client/src/components/listing-details-modal.tsx: Rename displayed fields, add visible contact number section
- [ ] Test all changes: Form submission, listing display, details modal

## Progress
- [x] Plan confirmed by user
- [x] Schema updated
- [x] Form modal updated
- [x] Listing card updated
- [x] Details modal updated
- [x] Testing completed
