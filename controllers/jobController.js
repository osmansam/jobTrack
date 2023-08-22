const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Job = require("../models/Job");

// GET ALL JOBS
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({}).sort("-createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

// GET SINGLE JOB
const getSingleJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new CustomError.NotFoundError(`No job with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

// CREATE JOB
const createJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

// UPDATE JOB
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!job) {
    throw new CustomError.NotFoundError(`No job with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

// DELETE JOB
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOneAndDelete({ _id: jobId });
  if (!job) {
    throw new CustomError.NotFoundError(`No job with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
};
