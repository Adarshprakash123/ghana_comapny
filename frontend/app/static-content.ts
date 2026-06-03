import blogsData from "../data/blogs.json";
import { defaultProperties, type BlogPost, type PropertyListing } from "./data";

export const staticBlogs = blogsData as BlogPost[];
export const staticProperties: PropertyListing[] = defaultProperties;
