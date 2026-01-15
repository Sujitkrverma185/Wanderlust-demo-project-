const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  return res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  return res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  return res.render("listings/show.ejs", { listing });
};

module.exports.createListings = async (req, res) => {
  const geoResponse = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
    .send();

  if (!geoResponse.body.features.length) {
    req.flash("error", "Location not found");
    return res.redirect("/listings/new");
  }

  const newListing = new Listing(req.body.listing);

  // Save geometry
  newListing.geometry = geoResponse.body.features[0].geometry;

  newListing.owner = req.user._id;
  newListing.image = {
    url: req.file.path,
    filename: req.file.filename
  };

  await newListing.save();

  req.flash("success", "New Listing created!");
  return res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/w_250,h_150,c_fill"
  );

  return res.render("listings/edit.ejs", {
    listing,
    originalImageUrl
  });
};

module.exports.updateListings = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing
  });

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await listing.save();
  }
  req.flash("success", "Listing updated!");
  return res.redirect(`/listings/${id}`);
};

module.exports.destroyListings = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted!");
  return res.redirect("/listings");
};
