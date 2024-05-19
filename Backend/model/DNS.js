import mongoose from "mongoose";

const dnsRecordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'PTR', 'SOA', 'SRV', 'TXT', 'DNSSEC'],
    required: true
  },
  value: {
    type: String,
    required: true
  },user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});


export const DNS = mongoose.model("DNS", dnsRecordSchema);

