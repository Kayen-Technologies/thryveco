import * as migration_20260725_201305_initial from './20260725_201305_initial';
import * as migration_20260725_223100_seed_homepage_figma from './20260725_223100_seed_homepage_figma';
import * as migration_20260725_223450_seed_homepage_media from './20260725_223450_seed_homepage_media';
import * as migration_20260725_223900_link_seeded_media_to_content from './20260725_223900_link_seeded_media_to_content';

import * as migration_20260726_120000_homepage_image_fields from './20260726_120000_homepage_image_fields';
import * as migration_20260726_123500_fix_media_static_dir from './20260726_123500_fix_media_static_dir';
import * as migration_20260726_130000_update_casa_muse_display from './20260726_130000_update_casa_muse_display';
import * as migration_20260726_140000_update_sole_name from './20260726_140000_update_sole_name';
import * as migration_20260726_150000_update_aure_display from './20260726_150000_update_aure_display';
import * as migration_20260726_160000_update_lune_display from './20260726_160000_update_lune_display';
import * as migration_20260726_170000_update_testimonial_accents from './20260726_170000_update_testimonial_accents';
import * as migration_20260726_180000_seed_footer_figma from './20260726_180000_seed_footer_figma';
import * as migration_20260726_190000_seed_about_page_figma from './20260726_190000_seed_about_page_figma';
import * as migration_20260727_100000_seed_journal_page_figma from './20260727_100000_seed_journal_page_figma';
import * as migration_20260727_112000_seed_site_logo from './20260727_112000_seed_site_logo';
import * as migration_20260727_120000_refresh_journal_entry_media from './20260727_120000_refresh_journal_entry_media';
import * as migration_20260727_130000_seed_journal_article_content from './20260727_130000_seed_journal_article_content';
import * as migration_20260727_140000_journal_article_blocks from './20260727_140000_journal_article_blocks';
import * as migration_20260727_150000_convert_blocks_to_richtext from './20260727_150000_convert_blocks_to_richtext';
import * as migration_20260727_195000_works_page_schema from './20260727_195000_works_page_schema';
import * as migration_20260727_200000_seed_works_page_figma from './20260727_200000_seed_works_page_figma';
import * as migration_20260727_210000_works_case_study_schema from './20260727_210000_works_case_study_schema';
import * as migration_20260727_210500_fix_works_case_study_version_tables from './20260727_210500_fix_works_case_study_version_tables';
import * as migration_20260727_211000_seed_casa_muse_case_study from './20260727_211000_seed_casa_muse_case_study';
import * as migration_20260727_220000_refresh_homepage_hero_intro_media from './20260727_220000_refresh_homepage_hero_intro_media';

export const migrations = [
  {
    up: migration_20260725_201305_initial.up,
    down: migration_20260725_201305_initial.down,
    name: '20260725_201305_initial'
  },
  {
    up: migration_20260725_223100_seed_homepage_figma.up,
    down: migration_20260725_223100_seed_homepage_figma.down,
    name: '20260725_223100_seed_homepage_figma'
  },
  {
    up: migration_20260725_223450_seed_homepage_media.up,
    down: migration_20260725_223450_seed_homepage_media.down,
    name: '20260725_223450_seed_homepage_media'
  },
  {
    up: migration_20260725_223900_link_seeded_media_to_content.up,
    down: migration_20260725_223900_link_seeded_media_to_content.down,
    name: '20260725_223900_link_seeded_media_to_content'
  },
  {
    up: migration_20260726_120000_homepage_image_fields.up,
    down: migration_20260726_120000_homepage_image_fields.down,
    name: '20260726_120000_homepage_image_fields'
  },
  {
    up: migration_20260726_123500_fix_media_static_dir.up,
    down: migration_20260726_123500_fix_media_static_dir.down,
    name: '20260726_123500_fix_media_static_dir'
  },
  {
    up: migration_20260726_130000_update_casa_muse_display.up,
    down: migration_20260726_130000_update_casa_muse_display.down,
    name: '20260726_130000_update_casa_muse_display'
  },
  {
    up: migration_20260726_140000_update_sole_name.up,
    down: migration_20260726_140000_update_sole_name.down,
    name: '20260726_140000_update_sole_name'
  },
  {
    up: migration_20260726_150000_update_aure_display.up,
    down: migration_20260726_150000_update_aure_display.down,
    name: '20260726_150000_update_aure_display'
  },
  {
    up: migration_20260726_160000_update_lune_display.up,
    down: migration_20260726_160000_update_lune_display.down,
    name: '20260726_160000_update_lune_display'
  },
  {
    up: migration_20260726_170000_update_testimonial_accents.up,
    down: migration_20260726_170000_update_testimonial_accents.down,
    name: '20260726_170000_update_testimonial_accents'
  },
  {
    up: migration_20260726_180000_seed_footer_figma.up,
    down: migration_20260726_180000_seed_footer_figma.down,
    name: '20260726_180000_seed_footer_figma'
  },
  {
    up: migration_20260726_190000_seed_about_page_figma.up,
    down: migration_20260726_190000_seed_about_page_figma.down,
    name: '20260726_190000_seed_about_page_figma'
  },
  {
    up: migration_20260727_100000_seed_journal_page_figma.up,
    down: migration_20260727_100000_seed_journal_page_figma.down,
    name: '20260727_100000_seed_journal_page_figma'
  },
  {
    up: migration_20260727_112000_seed_site_logo.up,
    down: migration_20260727_112000_seed_site_logo.down,
    name: '20260727_112000_seed_site_logo'
  },
  {
    up: migration_20260727_120000_refresh_journal_entry_media.up,
    down: migration_20260727_120000_refresh_journal_entry_media.down,
    name: '20260727_120000_refresh_journal_entry_media'
  },
  {
    up: migration_20260727_130000_seed_journal_article_content.up,
    down: migration_20260727_130000_seed_journal_article_content.down,
    name: '20260727_130000_seed_journal_article_content'
  },
  {
    up: migration_20260727_140000_journal_article_blocks.up,
    down: migration_20260727_140000_journal_article_blocks.down,
    name: '20260727_140000_journal_article_blocks'
  },
  {
    up: migration_20260727_150000_convert_blocks_to_richtext.up,
    down: migration_20260727_150000_convert_blocks_to_richtext.down,
    name: '20260727_150000_convert_blocks_to_richtext'
  },
  {
    up: migration_20260727_195000_works_page_schema.up,
    down: migration_20260727_195000_works_page_schema.down,
    name: '20260727_195000_works_page_schema'
  },
  {
    up: migration_20260727_200000_seed_works_page_figma.up,
    down: migration_20260727_200000_seed_works_page_figma.down,
    name: '20260727_200000_seed_works_page_figma'
  },
  {
    up: migration_20260727_210000_works_case_study_schema.up,
    down: migration_20260727_210000_works_case_study_schema.down,
    name: '20260727_210000_works_case_study_schema'
  },
  {
    up: migration_20260727_210500_fix_works_case_study_version_tables.up,
    down: migration_20260727_210500_fix_works_case_study_version_tables.down,
    name: '20260727_210500_fix_works_case_study_version_tables'
  },
  {
    up: migration_20260727_211000_seed_casa_muse_case_study.up,
    down: migration_20260727_211000_seed_casa_muse_case_study.down,
    name: '20260727_211000_seed_casa_muse_case_study'
  },
  {
    up: migration_20260727_220000_refresh_homepage_hero_intro_media.up,
    down: migration_20260727_220000_refresh_homepage_hero_intro_media.down,
    name: '20260727_220000_refresh_homepage_hero_intro_media'
  },
];
