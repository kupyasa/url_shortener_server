import mongoose from "mongoose";
import ShortLink from "../models/shortLink.js";
import { isValidUrl } from "../utils/utils.js";
import { nanoid } from "nanoid";
import md5 from "md5";

export const createShortLink = async (req, res) => {
  const form = req.body;
  const base = process.env.BASE_URL;

  if (!form.specialName) {
    form.specialName = nanoid(10);
  }

  while (await ShortLink.exists({ specialName: form.specialName })) {
    form.specialName = nanoid(10);
  }

  if (isValidUrl(form.originalUrl)) {
    try {
      const shortenedUrl = `${base}/shortlinks/${md5(form.specialName)}`;

      const shortLink = ShortLink({
        _id: md5(form.specialName),
        originalUrl: form.originalUrl,
        shortenedUrl: shortenedUrl,
        createdBy: form.createdBy ? form.createdBy : "Bilinmiyor",
        specialName: form.specialName,
        createdAt: new Date().toISOString(),
        expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
        clickCount: 0,
      });

      await shortLink.save();
      return res.json(shortLink);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(400).json({ message: "Geçersiz URL" });
  }
};

export const getShortLink = async (req, res) => {
  const { hashedId: _id } = req.params;

  try {
    if (await ShortLink.exists({ _id: _id })) {
      const url = await ShortLink.findOne({ _id: _id });
      if (url.expiresAt == null || new Date(url.expiresAt) > new Date()) {
        await ShortLink.updateOne({ _id: _id }, { $inc: { clickCount: 1 } });
        return res.redirect(url.originalUrl);
      } else {
        return res
        .status(404)
        .json({ message: "Böyle bir URL yok veya geçerlilik süresi bitmiş." });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Böyle bir URL yok veya geçerlilik süresi bitmiş." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const searchShortLink = async (req, res) => {
  const { searchQuery } = req.query;
  const searchQueryCaseInsensitive = new RegExp(searchQuery, "i");
  try {
    const searchedShortLinks = await ShortLink.find({
      $or: [
        { _id: searchQueryCaseInsensitive },
        { originalUrl: searchQueryCaseInsensitive },
        { specialName: searchQueryCaseInsensitive },
      ],
    });

    res.json({ shortLinks: searchedShortLinks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const mostClickedLinks = async (req, res) => {
  try {
    const mostClickedLinks = await ShortLink.find()
      .sort({ clickCount: "desc" })
      .limit(10);

    res.json({ mostClickedLinks: mostClickedLinks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const topLinkCreators = async (req, res) => {
  try {
    const topLinkCreators = await ShortLink.aggregate()
      .sortByCount("createdBy")
      .limit(10);

    res.json({ topLinkCreators: topLinkCreators });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
