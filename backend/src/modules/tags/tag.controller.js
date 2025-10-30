import * as tagService from './tag.service.js';

export async function createTag(req, res, next) {
  try {
    const tag = await tagService.createTag(req.body);
    res.status(201).json({ success: true, data: tag });
  } catch (err) {
    next(err);
  }
}

export async function getTags(req, res, next) {
  try {
    const tags = await tagService.getAllTags();
    res.json({ success: true, data: tags });
  } catch (err) {
    next(err);
  }
}

export async function getTag(req, res, next) {
  try {
    const tag = await tagService.getTagById(req.params.id);
    if (!tag) return res.status(404).json({ success: false, message: 'Tag not found' });
    res.json({ success: true, data: tag });
  } catch (err) {
    next(err);
  }
}

export async function updateTag(req, res, next) {
  try {
    const tag = await tagService.updateTag(req.params.id, req.body);
    res.json({ success: true, data: tag });
  } catch (err) {
    next(err);
  }
}

export async function deleteTag(req, res, next) {
  try {
    await tagService.deleteTag(req.params.id);
    res.json({ success: true, message: 'Tag deleted' });
  } catch (err) {
    next(err);
  }
}
